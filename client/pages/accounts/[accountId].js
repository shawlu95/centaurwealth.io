import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketDetail = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

TicketDetail.getInitialProps = async (context, axios) => {
  const { ticketId } = context.query;
  const { data } = await axios.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};
export default TicketDetail;
