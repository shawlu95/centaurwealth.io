import axios from 'axios';
import { useState } from 'react';

/** @notice method must be post|get|patch */
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        // exec callback if provided
        onSuccess(res.data);
      }
      return res.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};

export default useRequest;
