import deepFreeze from 'deep-freeze';
import { getInitialNavState, getSameRoutesCount, getPreviousDifferentRoute } from '../navSelectors';

describe('getInitialNavState', () => {
  test('if logged in, preserve the state', () => {
    const state = deepFreeze({
      accounts: [{ apiKey: '123' }],
      nav: {
        routes: [{ routeName: 'route1' }, { routeName: 'route2' }],
      },
    });

    const nav = getInitialNavState(state);

    expect(nav.routes.length).toEqual(2);
    expect(nav.routes[0].routeName).toEqual('route1');
    expect(nav.routes[1].routeName).toEqual('route2');
  });

  test('if not logged in, and no previous accounts, show realm screen', () => {
    const state = deepFreeze({
      accounts: [],
      nav: {
        routes: [],
      },
    });

    const nav = getInitialNavState(state);

    expect(nav.routes.length).toBe(1);
    expect(nav.routes[0].routeName).toEqual('realm');
  });

  test('if more than one account and no active account, display account list', () => {
    const state = deepFreeze({
      accounts: [{}, {}],
      nav: {
        routes: [],
      },
    });

    const nav = getInitialNavState(state);

    expect(nav.routes.length).toBe(1);
    expect(nav.routes[0].routeName).toEqual('account');
  });

  test('when only a single account and no other properties, redirect to realm', () => {
    const state = deepFreeze({
      accounts: [{ realm: 'https://example.com' }],
      nav: {
        routes: [],
      },
    });

    const nav = getInitialNavState(state);

    expect(nav.routes.length).toBe(1);
    expect(nav.routes[0].routeName).toEqual('realm');
  });

  test('when multiple accounts and default one has realm and email, show account list', () => {
    const state = deepFreeze({
      accounts: [
        { realm: 'https://example.com', email: 'johndoe@example.com' },
        { realm: 'https://example.com', email: 'janedoe@example.com' },
      ],
      nav: {
        routes: [],
      },
    });

    const nav = getInitialNavState(state);

    expect(nav.routes.length).toBe(1);
    expect(nav.routes[0].routeName).toEqual('account');
  });

  test('when default account has server and email set, redirect to realm screen', () => {
    const state = deepFreeze({
      accounts: [{ realm: 'https://example.com', email: 'johndoe@example.com' }],
      nav: {
        routes: [],
      },
    });

    const nav = getInitialNavState(state);

    expect(nav.routes.length).toBe(1);
    expect(nav.routes[0].routeName).toEqual('realm');
  });
});

describe('getSameRoutesCount', () => {
  test('if no routes the count of same routes is 0', () => {
    const state = deepFreeze({
      nav: {
        routes: [],
      },
    });

    const count = getSameRoutesCount(state);

    expect(count).toEqual(0);
  });

  test('if last route differs from  routes the count of same routes is 0', () => {
    const state = deepFreeze({
      nav: {
        routes: [{ routeName: 'main' }, { routeName: 'chat' }],
      },
    });

    const count = getSameRoutesCount(state);

    expect(count).toEqual(1);
  });

  test('if several of the last routes are the same return their count', () => {
    const state = deepFreeze({
      nav: {
        routes: [
          { routeName: 'login' },
          { routeName: 'main' },
          { routeName: 'chat' },
          { routeName: 'chat' },
          { routeName: 'chat' },
        ],
      },
    });

    const count = getSameRoutesCount(state);

    expect(count).toEqual(3);
  });

  test('if params of the routes differ consider them different routes', () => {
    const state = deepFreeze({
      nav: {
        routes: [
          { routeName: 'login' },
          { routeName: 'main' },
          { routeName: 'chat', params: { key: 'value' } },
          { routeName: 'chat', params: { key: 'another value' } },
          { routeName: 'chat', params: { anotherKey: 'some value' } },
        ],
      },
    });

    const count = getSameRoutesCount(state);

    expect(count).toEqual(1);
  });
});

describe('getPreviousDifferentRoute', () => {
  test('if no routes previous route is empty', () => {
    const state = deepFreeze({
      nav: {
        routes: [],
      },
    });

    const count = getPreviousDifferentRoute(state);

    expect(count).toEqual('');
  });

  test('if only one route previous route is empty', () => {
    const state = deepFreeze({
      nav: {
        routes: [{ key: 'main-1', routeName: 'main' }],
      },
    });

    const count = getPreviousDifferentRoute(state);

    expect(count).toEqual('');
  });

  test('if last route differs from  routes the last of same routes is the previous item', () => {
    const state = deepFreeze({
      nav: {
        routes: [{ key: 'main-1', routeName: 'main' }, { key: 'chat-1', routeName: 'chat' }],
      },
    });

    const count = getPreviousDifferentRoute(state);

    expect(count).toEqual('main-1');
  });

  test('if several of the last routes are the same return the first different route', () => {
    const state = deepFreeze({
      nav: {
        routes: [
          { key: 'login-1', routeName: 'login' },
          { key: 'main-1', routeName: 'main' },
          { key: 'chat-1', routeName: 'chat' },
          { key: 'chat-2', routeName: 'chat' },
          { key: 'chat-3', routeName: 'chat' },
        ],
      },
    });

    const count = getPreviousDifferentRoute(state);

    expect(count).toEqual('main-1');
  });

  test('if all routes are the same return the first one', () => {
    const state = deepFreeze({
      nav: {
        routes: [
          { key: 'chat-1', routeName: 'chat' },
          { key: 'chat-2', routeName: 'chat' },
          { key: 'chat-3', routeName: 'chat' },
        ],
      },
    });

    const count = getPreviousDifferentRoute(state);

    expect(count).toEqual('chat-1');
  });
});
