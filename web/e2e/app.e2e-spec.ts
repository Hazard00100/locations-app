import { ImagesWebPage } from './app.po';

describe('web App', () => {
  let page: ImagesWebPage;

  beforeEach(() => {
    page = new ImagesWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
