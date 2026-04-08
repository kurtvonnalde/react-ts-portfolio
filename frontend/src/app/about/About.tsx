import { ComingSoon } from "../../components/ComingSoon/page";
import "./About.css";



export default function App() {
  
  return (
    <div className="layout">
        <ComingSoon>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brandDot" />
          <div className="brandText">
            <div className="brandTitle">Healthcare Bot</div>
            <div className="brandSub">Your personal health assistant</div>
          </div>
        </div>

        <button className="newChatBtn"
          >
          + New chat
        </button>

        <div className="sidebarHint">
          Messages are saved in
        </div>
      </aside>

      {/* Chat */}
      <main className="chat">
        <header className="chatHeader">
          <div className="chatHeaderTitle">Conversation</div>
          <div className="chatHeaderSub">Assistant left • You right</div>
        </header>

        <div className="messages">
          
            <div
              
              
            >
              {/* Avatar on the side */}
              <div 
              >
                
                
              </div>

              {/* Bubble area */}
              <div className="msgBody">
                <div className="msgMeta">
                  <span className="msgName"></span>
                  <span className="msgTime">
                    
                  </span>
                </div>

                <div >
                
                    <span>
                     
                     
                      <br />
                    </span>
                 
                </div>
              </div>
            </div>
         

          <div  />
        </div>
       
        <div className="msgTime">
          <div className="composerHint">Assistant Thinking…</div>
        </div>
     

        {/* Composer */}
        <div className="composerWrap">
          <div className="composer">
            <textarea
              placeholder="Ask anything…"
             
              
              rows={1}
            />
           
<div className="row">
  <label>Top K</label>
  <select
    
  >
    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
      <option key={n} value={n}>
        {n}
      </option>
    ))}
  </select>
</div>


            <button className="sendBtn"   
          >
           Send
            </button>
          </div>

          <div className="composerHint">
            Enter to send • Shift+Enter for newline
          </div>
        </div>
      </main>

          <div></div>
          </ComingSoon>
    </div>
  );
}