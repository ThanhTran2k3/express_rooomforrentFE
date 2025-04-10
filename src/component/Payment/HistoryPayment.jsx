import React, { useEffect, useState } from 'react';
import { getInvoiceOfUser } from '../../api/invoiceApi';
import { useUser } from '../../UserContext';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

const HistoryPayment = () => {

    const [activeButton, setActiveButton] = useState('all');
    const { userInfo } = useUser();
    const [listInvoice, setListInvoice] = useState([])
    const navigate = useNavigate()
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const [service, setService] = useState(null);            
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    
    
    

    useEffect(() => {
        const fetchData = async (pageNum, service) => {
            const result = await getInvoiceOfUser(userInfo, navigate, pageNum, service);
            setListInvoice(result.content);
            setTotalPage(result.totalPage);
            setPage(result.currentPage);
        };
        fetchData(newPage, service);
    }, [service,newPage,navigate,userInfo]);

    useEffect(() => {
        if (activeButton) {
            if (activeButton === 'Tin nổi bật') {
                setService('Tin nổi bật');
            } else if (activeButton === 'Tin ưu tiên') {
                setService('Tin ưu tiên');
            }else if (activeButton === 'Gia hạn bài') {
                setService('Gia hạn bài');
            } else {
                setService(null);
            }
        }
    }, [activeButton]);

    const handleButtonClick = async(buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
    };
    
    return (
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton==='all'?'red-underline':''}`} onClick={() => handleButtonClick('all')}>
                    Tất cả
                </button>
                <button className={`btn ${activeButton==='Tin nổi bật'?'red-underline':''}`} onClick={() => handleButtonClick('Tin nổi bật')}>
                    Tin nổi bật
                </button>
                <button className={`btn ${activeButton==='Tin ưu tiên'?'red-underline':''}`} onClick={() => handleButtonClick('Tin ưu tiên')}>
                    Tin ưu tiên
                </button>
                <button className={`btn ${activeButton==='Gia hạn bài'?'red-underline':''}`} onClick={() => handleButtonClick('Gia hạn')}>
                    Gia hạn
                </button>
                
            </div>
            <div className="invoice-list">
                {listInvoice.length !== 0 ? (
                    <>
                        {listInvoice.map((item) => (
                            <div key={item.invoiceId} className="invoice-item d-flex justify-content-between align-items-start p-3 border rounded mb-3 shadow-sm">
                            <div className="w-75">
                                <h5 className="mb-2">{item.service.serviceName}</h5>
                                <p className="mb-1">Ngày thanh toán: {moment(item.issueDate).format('DD-MM-YYYY')}</p>
                                <p className="mb-0">Nội dung: {item.content}</p>
                            </div>
                            <div className="text-end mt-1">
                                <p className='fw-bold text-danger'>
                                 - ${item.totalPrice.toLocaleString()} đ
                                </p>
                            </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={page} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                        </div>
                    </>
                ) : (
                    <div className="no-invoices">
                        <p>Không có hóa đơn để hiển thị.</p>
                    </div>
                )}
               
            </div>
            
            </div>
    );
};

export default HistoryPayment;