import { toast } from 'react-toastify';

export const displayErrors = (errors) => {
  for (var i in errors) {
    // toast.error(errors[i].message);
    console.log(errors[i].message);
  }
};
