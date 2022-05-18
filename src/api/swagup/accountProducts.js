import axios from '../DashBoard';
import apiPaths from '../../utils/apiPaths';
import { status200  } from './status.utils';

// TODO: This shouldn't be necessary in the near future
const patchNegativeStock = products =>
  products?.map(product => ({
    ...product,
    stock: product.stock.map(s => ({
      ...s,
      quantity: Math.max(0, s.quantity)
    }))
  }));

export default {
  fetch: params =>
    axios.get(apiPaths.accountProducts, { ...status200, params }).then(response => ({
      ...response.data,
      status: response.status, // TODO: Remove after refactoring to use react query
      result: response.result, // TODO: Remove after refactoring to use react query
      results: patchNegativeStock(response.data.results)
    })).catch(() => ({ results: [] }))
};
