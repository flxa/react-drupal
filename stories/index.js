import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { checkA11y } from '@storybook/addon-a11y';
import { linkTo } from '@storybook/addon-links';
import { withReadme, withDocs }  from 'storybook-readme';
import ButtonReadme from '../components/Button/README.md';
import Button from '../components/Button';

const stories = storiesOf('Button', module);
stories.addDecorator(withKnobs);
stories.addDecorator(checkA11y);

stories.add(
  'with text',
  () => (<Button onClick={action('clicked')}>Some button</Button>),
);

stories.add('with some emoji', () => (
    <Button onClick={linkTo('Button', 'wit notes')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));

stories.add('wit notes', withNotes('Finally some notes are working')(() =>
    <Button onClick={action('slapped')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));

stories.add('wit knobs', withNotes('Finally some notes are working')(() =>
  <Button onClick={action('slapped')} disabled={boolean('Disabled', false)}>
    <span role="img" aria-label="so cool">{text('Label', 'Hello Storybook 😀 😎 👍 💯')}</span>
  </Button>
));

stories.add(
  'wit issues',
  withNotes('Finally some notes are working')(
    () => <Button onClick={action('slapped')} disabled={boolean('Disabled', false)} />,
  ),
);

storiesOf('Addon Chapters')
  .addWithChapters(
    'Story With Chapters',
    {
      subtitle: 'Story Subtitle',
      info: 'Story information paragraph',
      chapters: [
        {
          title: 'Chapter title',
          subtitle: 'Chapter Subtitle',
          info: 'Chapter info',
          sections: [
            {
              title: 'Section Title',
              subtitle: 'Section Subtitle',
              info: 'Section information paragraph',
              sectionFn: () => (<Button label="My Button" onClick={() => { alert('Hello World!'); }} />),
              options: {
                showSource: true,
                allowSourceToggling: true,
                showPropTables: true,
                allowPropTablesToggling: true,
              },
            },
          ],
        },
      ],
    },
  );

storiesOf('Button with readme', module)
  .add('Default', withReadme(ButtonReadme, () => <Button onClick={action('clicked')} label="Hello Button" />));
