import withStyles from '@mui/styles/withStyles';
import MuiAccordionSummary from '@mui/material/AccordionSummary';

export const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 30,
    '&$expanded': {
      minHeight: 30,
    },
  },
  content: {
    margin: '8px 0',
    '&$expanded': {
      margin: '8px 0',
    },
    display: 'flex',
    justifyContent: 'center',
  },
  expanded: {},
})(MuiAccordionSummary);
