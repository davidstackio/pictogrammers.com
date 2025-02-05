import { FunctionComponent } from 'react';
import cx from 'clsx';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';

import Link from '../Link/Link';
import Code from '../CodeHighlighter/CodeHighlighter';

import classes from './IconUsageExamples.module.scss';

interface ExampleWebfontProps {
  library: string;
  iconName: string;
  visible: boolean;
}

const ExampleWebfont: FunctionComponent<ExampleWebfontProps> = ({ iconName, library, visible }) => {
  return (
    <div
      aria-labelledby='example-tab-webfont'
      className={classes.example}
      hidden={!visible}
      id='example-tabpanel-webfont'
      role='tabpanel'
    >
      <Code className={cx('language-html', classes.code)} displayAsBlock>
{`<span class="${library} ${library}-${iconName}"></span>`}
      </Code>
      <Alert severity='warning' sx={{ margin: '1rem 0' }}>
        We highly recommend you <strong>do not</strong> use the webfont. See <Link href='/docs/guides/webfont-alternatives'>Webfont Alternatives</Link> for more information.
      </Alert>
      <Button
        color='secondary'
        component={Link}
        fullWidth
        href={`/docs/library/${library}/getting-started/webfont`}
        size='large'
        startIcon={<Icon path={mdiArrowRight} size={1} />}
        sx={{ textDecoration: 'none' }}
        variant='contained'
      >
        Start Using this Icon
      </Button>
    </div>
  );
};

export default ExampleWebfont;