// import React, { FC, useEffect, useState } from 'react';
// import './WineDetails.scss';
// import { useLocation, useNavigate } from 'react-router';
// import { GetWinesById, AddWineReview, deleteWineReview } from '../../service/wines';
// import { WineModel } from '../../models/wine';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../redux/shoppingSlice';

// const WineDetails: FC = () => {
//   const [WineDetail, setWineDetail] = useState<null | WineModel>(null);
//   const [newReview, setNewReview] = useState('');
//   const [addedToCart, setAddedToCart] = useState(false);

//   const location = useLocation();
//   const myNavigate = useNavigate();
//   const dispatch = useDispatch();

//   const currentCustomerId = JSON.parse(sessionStorage.getItem('user-data') || '{}').id;
// const currentCustomerName = JSON.parse(sessionStorage.getItem('user-data') || '{}').name;

//   const handleAddToCart = () => {
//     if (WineDetail) {
//       dispatch(addToCart(WineDetail));
//       setAddedToCart(true);
//       setTimeout(() => setAddedToCart(false), 3000);
//     }
//   };

//   useEffect(() => {
//     const myId = location.state?.id;
//     if (!myId) return;

//     GetWinesById(myId)
//       .then((res: any) => setWineDetail(res.data))
//       .catch(err => console.error(err));
//   }, [location.state]);

//   const handleAddReview = async () => {
//   if (!newReview.trim()) {
//     alert('אנא כתוב חוות דעת לפני השליחה');
//     return;
//   }
//   if (!WineDetail) return;

//   try {
//     const reviewObj = {
//       clientId: currentCustomerId,
//       clientName: currentCustomerName,
//       comment: newReview.trim(),
//     };
//     const res = await AddWineReview(WineDetail.id.toString(), reviewObj);
//     setWineDetail(res.data);
//     setNewReview('');
//   } catch (err) {
//     console.error(err);
//     alert('הייתה שגיאה בשליחת חוות הדעת');
//   }
// };


//   const handleDeleteReview = async (index: number) => {
//     if (!WineDetail) return;

//     try {
//       const res = await deleteWineReview(WineDetail.id.toString(), index);
//       setWineDetail(res.data);
//     } catch (err) {
//       console.error(err);
//       alert('שגיאה במחיקת חוות הדעת');
//     }
//   };

//   return (
    
//     <div className="WineDetails">
//       {WineDetail ? (
//         <div className="wine-container">
//           <div className="wine-image-side">
//             <img
//               className="wine-image"
//               src={`http://localhost:2000/image/${WineDetail.image}`}
//               alt={WineDetail.name}
//             />
//             {addedToCart && <p className="cart-message">🍷 נוסף לסל!</p>}
//           </div>

//           <div className="details">
//             <h1>{WineDetail.name}</h1>
//             <h3>{WineDetail.category}</h3>
//             <p>{WineDetail.description}</p>
//             <p>מחיר: {WineDetail.price} ₪</p>
//             <p>{WineDetail.totalSold} אנשים קנו אותי 😊</p>

//             <h3>חוות דעת:</h3>
//             <ul className="reviews-list">
//   {(WineDetail.reviews ?? []).map((r, i) => {
//     return (
//       <li key={i}>
//         {r.comment}
//         {String(r.clientId) === currentCustomerId && (
//           <button
//             className="delete-review-btn"
//             onClick={() => handleDeleteReview(i)}
//           >
//             למחיקה❌
//           </button>
//         )}
//       </li>
//     );
//   })}
// </ul>


//             <div className="add-review">
//               <textarea
//                 placeholder="כתוב חוות דעת חדשה..."
//                 value={newReview}
//                 onChange={e => setNewReview(e.target.value)}
//                 rows={4}
//               />
//               <button onClick={handleAddReview}>שלח חוות דעת</button>
//             </div>
//             <br />
//             <button className="add-to-cart" onClick={handleAddToCart}>הוסף לסל </button>
//             <br />
//             <button className="go-cart-btn" onClick={() => myNavigate('/Home/ShoppingCart')}>
//               לסל קניות🛒
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p>טוען פרטי יין...</p>
//       )}
//     </div>
//   );
// };

// export default WineDetails;
import React, { FC, useEffect, useState } from 'react';
import './WineDetails.scss';
import { useLocation, useNavigate } from 'react-router';
import { GetWinesById, AddWineReview, deleteWineReview } from '../../service/wines';
import { WineModel } from '../../models/wine';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/shoppingSlice';
import { showMessage } from '../../redux/messageSlice';

const WineDetails: FC = () => {
  const [WineDetail, setWineDetail] = useState<null | WineModel>(null);
  const [newReview, setNewReview] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const location = useLocation();
  const myNavigate = useNavigate();
  const dispatch = useDispatch();

  const currentCustomerId = JSON.parse(sessionStorage.getItem('user-data') || '{}').id;
  const currentCustomerName = JSON.parse(sessionStorage.getItem('user-data') || '{}').name;

  const handleAddToCart = () => {
    if (WineDetail) {
      dispatch(addToCart(WineDetail));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  useEffect(() => {
    const myId = location.state?.id;
    if (!myId) return;

    GetWinesById(myId)
      .then((res: any) => setWineDetail(res.data))
      .catch(err => {
        console.error(err);
        dispatch(showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה בטעינת פרטי היין',
          delay: 4000
        }));
      });
  }, [location.state]);

  const handleAddReview = async () => {
    if (!newReview.trim()) {
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'אנא כתוב חוות דעת לפני השליחה',
        delay: 4000
      }));
      return;
    }
    if (!WineDetail) return;

    try {
      const reviewObj = {
        clientId: currentCustomerId,
        clientName: currentCustomerName,
        comment: newReview.trim(),
      };
      const res = await AddWineReview(WineDetail.id.toString(), reviewObj);
      setWineDetail(res.data);
      setNewReview('');
      dispatch(showMessage({
        title: 'הצלחה',
        body: 'חוות הדעת נשלחה בהצלחה!',
        delay: 3000
      }));
    } catch (err) {
      console.error(err);
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'הייתה שגיאה בשליחת חוות הדעת',
        delay: 4000
      }));
    }
  };

  const handleDeleteReview = async (index: number) => {
    if (!WineDetail) return;

    try {
      const res = await deleteWineReview(WineDetail.id.toString(), index);
      setWineDetail(res.data);
      dispatch(showMessage({
        title: 'הצלחה',
        body: 'חוות הדעת נמחקה בהצלחה',
        delay: 3000
      }));
    } catch (err) {
      console.error(err);
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'שגיאה במחיקת חוות הדעת',
        delay: 4000
      }));
    }
  };

  return (
    <div className="WineDetails">
      {WineDetail ? (
        <div className="wine-container">
          <div className="wine-image-side">
            <img
              className="wine-image"
              src={`http://localhost:2000/image/${WineDetail.image}`}
              alt={WineDetail.name}
            />
            {addedToCart && <p className="cart-message">🍷 נוסף לסל!</p>}
          </div>

          <div className="details">
            <h1>{WineDetail.name}</h1>
            <h3>{WineDetail.category}</h3>
            <p>{WineDetail.description}</p>
            <p>מחיר: {WineDetail.price} ₪</p>
            <p>{WineDetail.totalSold} אנשים קנו אותי 😊</p>

            <h3>חוות דעת:</h3>
            <ul className="reviews-list">
              {(WineDetail.reviews ?? []).map((r, i) => (
                <li key={i}>
                  {r.comment}
                  {String(r.clientId) === currentCustomerId && (
                    <button
                      className="delete-review-btn"
                      onClick={() => handleDeleteReview(i)}
                    >
                      למחיקה❌
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="add-review">
              <textarea
                placeholder="כתוב חוות דעת חדשה..."
                value={newReview}
                onChange={e => setNewReview(e.target.value)}
                rows={4}
              />
              <button onClick={handleAddReview}>שלח חוות דעת</button>
            </div>
            <br />
            <button className="add-to-cart" onClick={handleAddToCart}>הוסף לסל </button>
            <br />
            <button className="go-cart-btn" onClick={() => myNavigate('/Home/ShoppingCart')}>
              לסל קניות🛒
            </button>
          </div>
        </div>
      ) : (
        <p>טוען פרטי יין...</p>
      )}
    </div>
  );
};

export default WineDetails;
