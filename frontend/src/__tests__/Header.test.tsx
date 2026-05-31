import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header navigation', () => {
  it('renders Home, Krawl, and CV links in desktop nav', () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const desktopNav = container.querySelector('#desktop-nav');
    expect(desktopNav).toBeTruthy();

    const nav = within(desktopNav as HTMLElement);
    expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(nav.getByRole('link', { name: 'Krawl' })).toHaveAttribute('href', '/about');
    expect(nav.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv');
  });
});
