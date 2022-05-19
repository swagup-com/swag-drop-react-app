import React, { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@swagup-com/react-ds-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styles from './styles/redeem';
import { ShipmentRow, TableEmptyState, RedeemPageDeleteModal } from './redeemCommon';
import { usePaginatedQuery } from '../../hooks';
import apiPaths from '../../utils/apiPaths';
import accountProductsApi from '../../api/swagup/accountProducts';
import { shipmentsApi } from '../../api/swagup';
import { TableCell, TableRow } from '../shared/TableCommon';
import ProductsCarousel from './ProductsCarousel';
import DetailsModal from '../shared/DetailsModal';
import Loader from '../shared/Loader';
import CenteredGrid from '../shared/CenteredGrid';
import Pagination from '../shared/Pagination';
import { makeStyles } from '@mui/styles';
import { redeemPages } from '../../api/swagdrop';


export const statuses = {
  idle: 'idle',
  pending: 'pending',
  success: 'success',
  successProcessed: 'success-processed',
  error: 'error'
};

const useStyles = makeStyles(styles);

const perPageOptions = [10, 20, 30, 40];

const RedeemPageHistory = () => {
  const [page, setPage] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useQuery('redeem-details', () => redeemPages.get(id), {
    enabled: !!id
  });

  const result = data?.data;

  useEffect(() => {
    if (result?.id) setPage(result);
  }, [result]);

  const redeemShipmentsParams = {
    source: `redeem-${page.id}`,
    ordering: '-created_at'
  };

  const {
    query: { data: shipmentsQuery, isLoading, status },
    pagination
  } = usePaginatedQuery({
    queryKey: [apiPaths.employeeOrders, redeemShipmentsParams],
    queryFn: (limit, offset) => {
      return shipmentsApi.fetch({ limit, offset, ...redeemShipmentsParams, isCancellable: false });
    },
    enabled: !!page.id,
    perPageOptions
  });

  const shipments = shipmentsQuery?.results;

  const accountProductsParams = {
    ids: page.products?.map(p => p.id).join()
  };

  const { data: accountProductsQueryResult } = useQuery(
    [apiPaths.accountProducts, accountProductsParams],
    () => {
      return accountProductsApi.fetch({ limit: 1000, offset: 0, ...accountProductsParams });
    },
    {
      enabled: !!page.id
    }
  );
  const accountProducts = accountProductsQueryResult?.results || [];

  const queryClient = useQueryClient();
  const deleteRedeem = useMutation(i => redeemPages.delete(i), {
    onSuccess: () => {
      queryClient.invalidateQueries(['redeem']);
      setDeleteModalOpen(false);
      return navigate('/swag-drop/redeems');
    }
  });

  const handleDeleteRedeem = () => {
    deleteRedeem.mutate(page.id);
  };

  return (
    <CenteredGrid className={classes.root} style={{ paddingTop: 0 }}>
      <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: 20, marginTop: 12 }}>
        <Grid item xs={12}>
          <Link to="/swag-drop/redeems" className={classes.goBack}>
            <ArrowBackIcon className={classes.goBackIcon} />
            Back to SwagDrop
          </Link>
        </Grid>
        <Grid item xs>
          <Typography variant="h1" style={{ fontSize: 40 }} className={classes.title}>
            {page.projectName}
          </Typography>
        </Grid>
        <Grid item style={{ paddingRight: 32 }}>
          <Button
            variant="text"
            onClick={() => setDeleteModalOpen(true)}
            style={{ color: '#F44336', borderColor: '#F44336' }}
          >
            Delete
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to={`/swag-drop/redeems/${page.urlSlug}`} style={{ minWidth: 180, height: 56 }}>
            Edit Page
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={8}
          style={{
            position: 'relative',
            minHeight: 528
          }}
        >
          <Grid container direction="column" className={classes.tableContainer}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipments?.map(shipment => (
                    <ShipmentRow key={shipment.id} shipment={shipment} showDetails={setSelectedShipment} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {shipments?.length === 0 && status === statuses.success && <TableEmptyState />}
          </Grid>
          <Grid container alignItems="center" className={classes.paginationContainer}>
            <Pagination {...pagination} startText="Show" endText="contacts" buttonClass={classes.paginationBtn} />
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: 32, paddingTop: 24, paddingBottom: 56 }}>
          {accountProducts.length > 0 && <ProductsCarousel products={accountProducts} />}
        </Grid>
      </Grid>
      <DetailsModal order={selectedShipment} onClose={() => setSelectedShipment(null)} />
      <RedeemPageDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteRedeem}
      />
      {deleteRedeem.isLoading && <Loader absolute />}
    </CenteredGrid>
  );
};

export default RedeemPageHistory;
