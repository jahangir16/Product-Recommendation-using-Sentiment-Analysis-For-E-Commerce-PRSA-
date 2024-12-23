# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface    
import logging
from itemadapter import ItemAdapter


class DarazPkPipeline:
    def process_item(self, item, spider):
        def filter_empty_reviews(reviews):
            return [''.join(review).replace('\n', '') for review in reviews if review and ''.join(review).replace('\n', '')]

        item['reviews'] = filter_empty_reviews(item['reviews'])

        return item
    
#now here i do all the code of how to connect to the database and how to save the data in the database
    #I AM USING postgresql database
    #so first i have to install the psycopg2 library
    #pip install psycopg2
    # NOW MADE A CLASS PostgresDemoPipeline


# pipelines.py

import psycopg2
import psycopg2.extras


class PostgresDemoPipeline:

    def __init__(self):
        # Initialize database connection
        self.connection = psycopg2.connect(host='localhost', user='postgres', password='123456', dbname='DarazProductsFinal')
        self.cur = self.connection.cursor()
        ## Create quotes table if none exists
         ## Create quotes table if none exists
        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS products(
            id serial PRIMARY KEY, 
            ProductName TEXT,
            BrandName TEXT,
            DiscountPrice TEXT,
            OriginalPrice TEXT,
            Rating TEXT,
            Category TEXT,
            ProductUrl TEXT,
            image_urls TEXT,
            images JSONB,
            sentiment_analyzed BOOLEAN DEFAULT FALSE,             
            CONSTRAINT unique_product UNIQUE (ProductName, BrandName)
        )
        """)
        
        ## Create reviews table if none exists
        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews(
    id SERIAL PRIMARY KEY,
    product_id INT,
    review_content TEXT,
    sentiment TEXT,
    CONSTRAINT unique_review UNIQUE (product_id, review_content),
    FOREIGN KEY (product_id) REFERENCES products(id)
)
        """)

    def process_item(self, item, spider):
        try:
            # Insert product data into products table
            self.cur.execute("""
                INSERT INTO products (ProductName, BrandName, DiscountPrice, OriginalPrice, Category, Rating, ProductUrl, image_urls, images)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (ProductName, BrandName) DO UPDATE 
                SET DiscountPrice = EXCLUDED.DiscountPrice, OriginalPrice = EXCLUDED.OriginalPrice, Category = EXCLUDED.Category, Rating = EXCLUDED.Rating, ProductUrl = EXCLUDED.ProductUrl, image_urls = EXCLUDED.image_urls, images = EXCLUDED.images
                RETURNING id
            """, (
                item.get("Productname"),
                item.get("BrandName"),
                item.get("DiscountPrice"),
                item.get("OriginalPrice"),
                item.get("Category"),
                item.get("Rating"),
                item.get("ProductUrl"),
                item.get("image_urls"),
                psycopg2.extras.Json(item.get("images")) if item.get("images") else None
            ))

            product_id_row = self.cur.fetchone()

            if product_id_row:
                product_id = product_id_row[0]

                # Insert reviews into the reviews table
                for review in item.get("reviews", []):
                    self.cur.execute("""
                        INSERT INTO reviews (product_id, review_content)
                        VALUES (%s, %s)
                        ON CONFLICT (product_id, review_content) DO NOTHING
                    """, (product_id, review))

                # Commit the transaction
                self.connection.commit()
            else:
                logging.error("No product ID returned from the database.")
        except Exception as e:
            logging.error(f"Error processing item: {e}")
            self.connection.rollback()  # Roll back the transaction in case of an error

        return item

    def close_spider(self, spider):
        # Close cursor and connection to the database
        self.cur.close()
        self.connection.close()