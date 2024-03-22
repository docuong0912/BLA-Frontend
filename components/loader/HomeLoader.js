import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const HomeLoader = () => {
  return (
    <div className='p-3'>
        {/* For variant="text", adjust the height via font-size */}
        <div >
            <Skeleton animation="wave" variant="rectangular" width={280} height={30} />
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '1rem' }} />
        </div>
        
        <div className='my-2'>
            <Skeleton animation="wave" variant="rectangular" width={280} height={30} />
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '1rem' }} />
        </div>
        <div className='my-2'>
            <Skeleton animation="wave" variant="rectangular" width={280} height={30} />
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '1rem' }} />
        </div>
        {/* For other variants, adjust the size with `width` and `height` */}
        
        
        
    </div>
    
  )
}

export default HomeLoader