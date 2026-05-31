import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sources from '../app/sources/Sources';

const ACCESS_KEY = 'myq36N&N99MsO';

describe('Sources page auth and upload flow', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ total: 0, sources: [] }),
      })
    );
  });

  it('shows page unlock modal when not yet authenticated', () => {
    render(
      <MemoryRouter>
        <Sources />
      </MemoryRouter>
    );

    expect(screen.getByText('Secure Data Source Access')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your security key to access the Data Sources page.')
    ).toBeInTheDocument();
  });

  it('unlocks page with valid key and shows upload button', async () => {
    render(
      <MemoryRouter>
        <Sources />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter security key'), {
      target: { value: ACCESS_KEY },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Unlock' }));

    expect(await screen.findByRole('button', { name: /upload document/i })).toBeInTheDocument();
  });

  it('opens file picker directly on upload click after page is unlocked', async () => {
    localStorage.setItem('sources_access_granted', 'true');

    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    render(
      <MemoryRouter>
        <Sources />
      </MemoryRouter>
    );

    const uploadBtn = await screen.findByRole('button', { name: /upload document/i });
    fireEvent.click(uploadBtn);

    expect(clickSpy).toHaveBeenCalled();
    expect(
      screen.queryByText('Please enter your security key to access the Data Sources page.')
    ).not.toBeInTheDocument();
  });
});
