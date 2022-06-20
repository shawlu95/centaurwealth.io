import Card from './card';

const Cards = ({ summary }) => {
  const groups = Object.assign({}, ...summary.map((x) => ({ [x.type]: x })));
  return (
    groups && (
      <div className='d-grid gap-3'>
        <div className='row'>
          <div className='col-sm-6'>
            <Card {...groups['asset']} />
          </div>
          <div className='col-sm-6'>
            <Card {...groups['liability']} />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <Card {...groups['equity']} />
          </div>
          <div className='col-sm-6'>
            <Card {...groups['temporary']} />
          </div>
        </div>
      </div>
    )
  );
};

export default Cards;
