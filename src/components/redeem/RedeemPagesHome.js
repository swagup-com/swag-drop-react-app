import React from 'react';
import { Grid, InputAdornment, Typography } from '@mui/material';
import { Button } from '@swagup-com/react-ds-components';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import styles from './styles/redeem';
import CenteredGrid from '../shared/CenteredGrid';
import  EmptyState  from '../shared/EmptyState';
import { CardsContainer } from '../shared/containers/Cards';
import { RedeemPageCard } from './redeemCommon';
import { OutlinedSearchField } from '../shared/Filters';
import { usePaginatedQuery, usePerPageOptions } from '../../hooks';
import solutiontriangle from '../../api/solutiontriangle';
import Loader from '../shared/Loader';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(styles);
const RedeemPagesHome = () => {
  const classes = useStyles();
  const perPageOptions = usePerPageOptions();
  const company = { id: 3719 };

  const { query: queryResult, pagination } = usePaginatedQuery({
    queryKey: ['redeem', company.id],
    queryFn: (limit, offset) => solutiontriangle.list({ limit, offset, company_id: company.id }),
    perPageOptions,
    enabled: !!company.id
  });

  const { data, isFetching } = queryResult;
  return (
    <CenteredGrid className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs alignItems="center">
          <Typography variant="h1" style={{ fontSize: 40 }} className={classes.title}>
            Swag Drops
          </Typography>
        </Grid>
        <Grid item style={{ paddingRight: 32 }}>
          <OutlinedSearchField
            // value={search}
            // onChange={e => onSearch(e.target.value)}
            variant="outlined"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#aaaaaa' }} />
              </InputAdornment>
            }
            className={classes.searchField}
          />
        </Grid>
        <Grid item>
          <Button component={Link} to="/redeem-pages-create" style={{ minWidth: 180, height: 56 }}>
            Create a SwagDrop
          </Button>
        </Grid>
      </Grid>
      <Grid style={{ paddingTop: 32, paddingBottom: 56 }}>
        {isFetching && <Loader absolute />}
        {!data || data.length === 0 ? (
          <EmptyState
            title="It’s pretty quiet in here. Why not launch a SwagDrop?"
            image={{
              path: '/images/redeem/swagdrop-empty.png',
              alt: '    ',
              text: 'Click “Create a SwagDrop” to get started'
            }}
            maxWidth={360}
          />
        ) : (
          <CardsContainer className={classes.cardsContainer}>
            {data.map(page => (
              <RedeemPageCard key={page.id} page={page} />
            ))}
          </CardsContainer>
        )}
      </Grid>
    </CenteredGrid>
  );
};

export default RedeemPagesHome;
