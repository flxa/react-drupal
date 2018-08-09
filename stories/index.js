import React from 'react';
import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { checkA11y } from '@storybook/addon-a11y';
import { linkTo } from '@storybook/addon-links';
import { withReadme }  from 'storybook-readme';
import Header from '../frontend/src/components/Header';
import Loading from '../frontend/src/components/Loading';
import Menu from '../frontend/src/components/Menu';
import Post from '../frontend/src/components/Post';
import Posts from '../frontend/src/components/Posts';

const stories = storiesOf('Button', module);
stories.addDecorator(withKnobs);
stories.addDecorator(checkA11y);

storiesOf('Header Components', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Header', () => <Header />)
  .add('Loading', () => <Loading />)
  .add('Menu', () => <Menu />);

storiesOf('Body Components', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Post', () => <Post />)
  .add('Posts', () => <Posts />);
