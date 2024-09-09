import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormCustomerAdd from './FormCustomerAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetCustomer } from 'api/customer';

// types
import { CustomerList } from 'types/customer';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  children: React.ReactNode;
  maxWidth?: number;
}

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export default function CustomModalForm({ open, modalToggler, children, maxWidth = 880 }: Props) {
  const closeModal = () => modalToggler(false);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 320, maxWidth: maxWidth, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>{children}</Box>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
