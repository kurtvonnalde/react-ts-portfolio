// ─────────────────────────────────────────────────────────────────────────────
// portfolio-infrastructure.bicep
// Deploys all Azure resources required by the AI-powered portfolio.
//
// Resources:
//   - Azure App Service Plan (Linux B1)
//   - Azure App Service — Backend (FastAPI / Python 3.12)
//   - Azure App Service — Frontend (React / Node 20)
//   - App Service Easy Auth (Google OAuth) on both apps
//   - Azure Cosmos DB account + database + containers (projects, users)
//   - Azure AI Search service
//   - Azure OpenAI account + GPT-4o deployment + text-embedding-3-small deployment
//   - Azure Storage Account
// ─────────────────────────────────────────────────────────────────────────────

// ─── Parameters ──────────────────────────────────────────────────────────────

@description('Short base name used as a prefix for all resource names.')
@minLength(2)
@maxLength(16)
param appName string = 'portfolio'

@description('Azure region to deploy all resources into.')
param location string = resourceGroup().location

@description('Deployment environment tag.')
@allowed(['dev', 'prod'])
param environment string = 'dev'

@description('Google OAuth 2.0 Client ID (from Google Cloud Console).')
param googleClientId string

@description('Google OAuth 2.0 Client Secret.')
@secure()
param googleClientSecret string

@description('Secret key used to authenticate admin API requests via the X-Admin-Key header.')
@secure()
param adminKey string

// ─── Variables ───────────────────────────────────────────────────────────────

var prefix = '${appName}-${environment}'

var appServicePlanName  = '${prefix}-plan'
var backendAppName      = '${prefix}-api'
var frontendAppName     = '${prefix}-web'
var cosmosAccountName   = '${prefix}-cosmos'
var searchServiceName   = '${prefix}-search'
var openAiAccountName   = '${prefix}-openai'
// Storage account names: 3-24 chars, lowercase alphanumeric only
var storageAccountName  = toLower(take(replace('${prefix}store', '-', ''), 24))

var cosmosDatabaseName        = 'aicopilotdb'
var cosmosProjectsContainer   = 'projects'
var cosmosUsersContainer      = 'users'

var gptDeploymentName       = 'gpt-4o'
var embeddingDeploymentName = 'text-embedding-3-small'
var searchIndexName         = 'portfolio-about-index'

// Computed hostnames (no circular resource dependency)
var backendHostname  = '${backendAppName}.azurewebsites.net'
var frontendHostname = '${frontendAppName}.azurewebsites.net'

// ─── Storage Account ─────────────────────────────────────────────────────────

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

// ─── Azure Cosmos DB ─────────────────────────────────────────────────────────

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    enableFreeTier: false
    disableLocalAuth: false
  }
}

resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: cosmosDatabaseName
  properties: {
    resource: { id: cosmosDatabaseName }
  }
}

resource cosmosProjectsContainerResource 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDatabase
  name: cosmosProjectsContainer
  properties: {
    resource: {
      id: cosmosProjectsContainer
      partitionKey: {
        paths: ['/ownerId']
        kind: 'Hash'
      }
      indexingPolicy: {
        automatic: true
        indexingMode: 'consistent'
      }
    }
  }
}

resource cosmosUsersContainerResource 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDatabase
  name: cosmosUsersContainer
  properties: {
    resource: {
      id: cosmosUsersContainer
      partitionKey: {
        paths: ['/userId']
        kind: 'Hash'
      }
      indexingPolicy: {
        automatic: true
        indexingMode: 'consistent'
      }
    }
  }
}

// ─── Azure AI Search ─────────────────────────────────────────────────────────

resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {
  name: searchServiceName
  location: location
  sku: { name: 'basic' }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    publicNetworkAccess: 'enabled'
    semanticSearch: 'free'
  }
}

// ─── Azure OpenAI ────────────────────────────────────────────────────────────

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: openAiAccountName
  location: location
  kind: 'OpenAI'
  sku: { name: 'S0' }
  properties: {
    publicNetworkAccess: 'Enabled'
    customSubDomainName: openAiAccountName
  }
}

resource gptDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openAiAccount
  name: gptDeploymentName
  sku: {
    name: 'Standard'
    capacity: 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-08-06'
    }
  }
}

resource embeddingDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openAiAccount
  name: embeddingDeploymentName
  sku: {
    name: 'Standard'
    capacity: 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'text-embedding-3-small'
      version: '1'
    }
  }
  // Deployments must be created sequentially under the same account
  dependsOn: [gptDeployment]
}

// ─── App Service Plan ────────────────────────────────────────────────────────

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true // required for Linux plans
  }
}

// ─── Backend App Service (FastAPI / Python 3.12) ─────────────────────────────

resource backendApp 'Microsoft.Web/sites@2023-01-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'PYTHON|3.12'
      appCommandLine: 'uvicorn app.main:app --host 0.0.0.0 --port 8000'
      alwaysOn: true
      cors: {
        allowedOrigins: ['https://${frontendHostname}']
        supportCredentials: true
      }
      appSettings: [
        // Cosmos DB
        { name: 'COSMOS_ENDPOINT',            value: cosmosAccount.properties.documentEndpoint }
        { name: 'COSMOS_KEY',                 value: cosmosAccount.listKeys().primaryMasterKey }
        { name: 'COSMOS_DATABASE',            value: cosmosDatabaseName }
        { name: 'COSMOS_CONTAINER_PROJECTS',  value: cosmosProjectsContainer }
        { name: 'COSMOS_CONTAINER_USERS',     value: cosmosUsersContainer }
        // Azure OpenAI
        { name: 'AZURE_OPENAI_ENDPOINT',          value: openAiAccount.properties.endpoint }
        { name: 'AZURE_OPENAI_API_KEY',           value: openAiAccount.listKeys().key1 }
        { name: 'AZURE_OPENAI_API_VERSION',       value: '2024-02-01' }
        { name: 'AZURE_OPENAI_DEPLOYMENT_NAME',   value: gptDeploymentName }
        { name: 'AZURE_EMBEDDING_DEPLOYMENT',     value: embeddingDeploymentName }
        // Azure AI Search
        { name: 'AZURE_SEARCH_ENDPOINT',    value: 'https://${searchService.name}.search.windows.net' }
        { name: 'AZURE_SEARCH_ADMIN_KEY',   value: searchService.listAdminKeys().primaryKey }
        { name: 'AZURE_SEARCH_INDEX_NAME',  value: searchIndexName }
        // Admin
        { name: 'ADMIN_KEY',  value: adminKey }
        { name: 'ADMIN_ID',   value: 'admin' }
        // CORS — allow the frontend origin
        { name: 'FRONTEND_ORIGINS', value: 'https://${frontendHostname}' }
        // Storage
        { name: 'AZURE_STORAGE_CONNECTION_STRING', value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net' }
        // Runtime build
        { name: 'SCM_DO_BUILD_DURING_DEPLOYMENT', value: 'true' }
      ]
    }
  }
}

// Easy Auth on the backend (allows the frontend to forward credentials)
resource backendAuthSettings 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: backendApp
  name: 'authsettingsV2'
  properties: {
    globalValidation: {
      requireAuthentication: false
      unauthenticatedClientAction: 'AllowAnonymous'
    }
    identityProviders: {
      google: {
        enabled: true
        registration: {
          clientId: googleClientId
          clientSecretSettingName: 'GOOGLE_CLIENT_SECRET'
        }
      }
    }
    login: {
      tokenStore: { enabled: true }
    }
    platform: { enabled: true }
  }
}

// ─── Frontend App Service (React / Node 20) ───────────────────────────────────

resource frontendApp 'Microsoft.Web/sites@2023-01-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        // Vite reads this at build time when SCM_DO_BUILD_DURING_DEPLOYMENT=true
        { name: 'VITE_API_BASE_URL',              value: 'https://${backendHostname}' }
        { name: 'SCM_DO_BUILD_DURING_DEPLOYMENT', value: 'true' }
        // Passed to npm run build
        { name: 'BUILD_COMMAND', value: 'npm run build' }
      ]
    }
  }
}

// Easy Auth on the frontend (Google login via /.auth/login/google)
resource frontendAuthSettings 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: frontendApp
  name: 'authsettingsV2'
  properties: {
    globalValidation: {
      requireAuthentication: false
      unauthenticatedClientAction: 'AllowAnonymous'
    }
    identityProviders: {
      google: {
        enabled: true
        registration: {
          clientId: googleClientId
          clientSecretSettingName: 'GOOGLE_CLIENT_SECRET'
        }
      }
    }
    login: {
      tokenStore: { enabled: true }
    }
    platform: { enabled: true }
  }
}

// Store the Google Client Secret in the frontend app settings
resource frontendGoogleSecret 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: frontendApp
  name: 'appsettings'
  properties: {
    GOOGLE_CLIENT_SECRET: googleClientSecret
    VITE_API_BASE_URL: 'https://${backendHostname}'
    SCM_DO_BUILD_DURING_DEPLOYMENT: 'true'
  }
  dependsOn: [frontendAuthSettings]
}

// ─── Outputs ─────────────────────────────────────────────────────────────────

@description('HTTPS URL of the deployed frontend.')
output frontendUrl string = 'https://${frontendApp.properties.defaultHostName}'

@description('HTTPS URL of the deployed backend API.')
output backendUrl string = 'https://${backendApp.properties.defaultHostName}'

@description('Azure Cosmos DB account endpoint.')
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint

@description('Azure AI Search service endpoint.')
output searchEndpoint string = 'https://${searchService.name}.search.windows.net'

@description('Azure OpenAI resource endpoint.')
output openAiEndpoint string = openAiAccount.properties.endpoint

@description('Azure Storage Account name.')
output storageAccountName string = storageAccount.name
