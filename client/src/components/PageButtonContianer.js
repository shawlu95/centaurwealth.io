import React from 'react';

import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageButtonContainer';
import { useDispatch } from 'react-redux';

const OFFSET = 5;

const PageButtonContianer = ({ totalPages, page, setPage }) => {
  const dispatch = useDispatch();

  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);
  const pages = range(
    Math.max(page - OFFSET, 1),
    Math.min(page + OFFSET, totalPages)
  );

  const nextPage = () => {
    dispatch(setPage({ page: Math.min(page + 1, totalPages) }));
  };
  const prevPage = () => {
    dispatch(setPage({ page: Math.max(page - 1, 1) }));
  };

  return (
    <Wrapper>
      <button type='button' className='prev-btn' onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className='btn-container'>
        {pages.map((pageNumber) => (
          <button
            type='button'
            key={pageNumber}
            className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
            onClick={() => dispatch(setPage({ page: pageNumber }))}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button type='button' className='next-btn' onClick={nextPage}>
        <HiChevronDoubleRight />
        next
      </button>
    </Wrapper>
  );
};

export default PageButtonContianer;
