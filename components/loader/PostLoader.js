import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const PostLoader = ()=>{
    return(
    <div>
        <div className="d-flex justify-content-start">
            <Skeleton animation="wave" variant="rectangular" width={50} height={50} />
            <div className="mx-2">
                    <Skeleton count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }} width={200} />
             </div>
        </div>
        <Skeleton className="my-4" animation="wave" variant="text" sx={{ fontSize: '1rem' }} />
        <hr/>
        <div className="m-3">
            <div className="d-flex align-items-center my-4">
                <Skeleton  animation="wave" circle={true} width={50} height={50} />
                <div className="mx-2">
                    <Skeleton count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }} width={100} height={15} />
                </div>
                
            </div>
            <Skeleton  count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }}  />
            <div className="d-flex align-items-center my-4">
                <Skeleton  animation="wave" circle={true} width={50} height={50} />
                <div className="mx-2">
                    <Skeleton count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }} width={100} height={15} />
                </div>
                
            </div>
            <Skeleton  count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }}  />
        </div>



        <hr className="my-5"/>
        <div className="d-flex justify-content-start">
            <Skeleton animation="wave" variant="rectangular" width={50} height={50} />
            <div className="mx-2">
                    <Skeleton count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }} width={200} />
             </div>
        </div>
        <Skeleton className="my-4" animation="wave" variant="text" sx={{ fontSize: '1rem' }} />
        <hr/>
        <div className="m-3">
            <div className="d-flex align-items-center my-4">
                <Skeleton  animation="wave" circle={true} width={50} height={50} />
                <div className="mx-2">
                    <Skeleton count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }} width={100} height={15} />
                </div>
                
            </div>
            <Skeleton  count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }}  />
            <div className="d-flex align-items-center my-4">
                <Skeleton  animation="wave" circle={true} width={50} height={50} />
                <div className="mx-2">
                    <Skeleton count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }} width={100} height={15} />
                </div>
                
            </div>
            <Skeleton  count={2} duration={2} animation="wave" variant="text" sx={{ fontSize: '1rem' }}  />
        </div>
    </div>
    );
}
export default PostLoader;