import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';  // Import the custom hook to check the logged-in user

const ProductDetails = ({ productId }) => {
  const { user } = useUser() || {};  // Add fallback in case `useUser()` returns undefined
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shopifyStoreUrl = 'https://kisanestoredev.myshopify.com/api/2023-01/graphql.json';  // Set your Shopify store URL here
  const accessToken = 'c2c0d5ac5aeae2d629915df7e7e422b6'; // Replace with your actual access token

  // Fetch product data from Shopify store
  useEffect(() => {
    const fetchProduct = async () => {
      const query = `
        query {
          product(id: "gid://shopify/Product/${productId}") {
            title
            descriptionHtml
            variants(first: 1) {
              edges {
                node {
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
          }
        }
      `;

      try {
        const response = await axios.post(
          shopifyStoreUrl,
          { query },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': accessToken,
            },
          }
        );

        const productData = response.data.data.product;
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product data');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle "Buy Now" button click
  const handleBuyNowClick = () => {
    if (user || localStorage.getItem('authToken')) {  // Check if user exists or token is available in localStorage
      window.location.href = '/checkout';  // Redirect to checkout if logged in
    } else {
      window.location.href = '/login';  // Redirect to login if not logged in
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.title}</h1>
      <img src={product.images.edges[0].node.src} alt={product.images.edges[0].node.altText} />
      <p dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      <p>{product.variants.edges[0].node.priceV2.amount} {product.variants.edges[0].node.priceV2.currencyCode}</p>
      <button onClick={handleBuyNowClick}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductDetails;
