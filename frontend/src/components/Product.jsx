import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top'/>
        </Link>
        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title className='product-title pb-4' as='div'>
                    <h1 className='text-ellipsis truncate text-lg'>{product.name}</h1>
                </Card.Title>
            </Link>

            <Card.Text className="pb-1" as='div'>
                <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
            </Card.Text>

            <Card.Text as='h3'>
                ${product.price}
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product