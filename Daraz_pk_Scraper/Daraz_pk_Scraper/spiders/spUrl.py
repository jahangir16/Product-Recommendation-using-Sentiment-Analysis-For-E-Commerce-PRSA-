import scrapy
from selenium import webdriver
import time
import pprint
import psycopg2
from scrapy.http import TextResponse
import logging

class DarazURLSpider(scrapy.Spider):
    name = "daraz13"
    allowed_domains = ["daraz.pk"]

    def __init__(self, *args, **kwargs):
        super(DarazURLSpider, self).__init__(*args, **kwargs)
        self.driver = None
        self.conn = None
        self.cur = None
        self.last_url = None
        pprint.pprint("SartingSpider********************************")
    def closed(self, reason):
        if self.driver:
            self.driver.quit()
        if self.conn:
            self.cur.close()
            self.conn.close()

    def start_requests(self):
        # Configure logging
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

        try:
            # Connect to PostgreSQL
            self.conn = psycopg2.connect(database="DarazProductsFinal", user="postgres", password="123456", host="localhost")
            self.cur = self.conn.cursor()
            self.cur.execute('CREATE TABLE IF NOT EXISTS product_urls ( id SERIAL PRIMARY KEY, url TEXT, category TEXT, processed BOOLEAN DEFAULT FALSE)')
            logging.info("Connected to the database and ensured table exists.")
        except Exception as e:
            logging.error(f"Database connection failed: {e}")
            return
        #open the page 
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()

        categories =  ['smartphones','headphones-headsets','wearable-technology','computing-peripherals-accessories']  # replace with your actual categories
        urls = [("https://www.daraz.pk/%s/?page=%d" % (category, i), category) for category in categories for i in range(1, 3)]
        for url, category in urls:
            yield scrapy.Request(url, meta={'category': category,'product_url': url})



    def parse(self, response):
        Producturl = response.meta['product_url']
        category = response.meta['category']
        try:
             # Selenium loads the page in a real browser instance
            self.driver.get(Producturl)
            time.sleep(3)  # Wait for JavaScript to load the content

            # Capture the entire page source rendered by JavaScript
            body = self.driver.page_source

            scrapy_response = TextResponse(url=response.url, body=body, encoding='utf-8')

            product_links = scrapy_response.css("div._95X4G a::attr(href)").getall()
            for link in product_links:
                # If the links are relative, prepend the base URL to make them absolute
                product_url = response.urljoin(link)
                self.logger.info(f"Product Link: {product_url}")

                self.cur.execute('SELECT COUNT(*) FROM product_urls WHERE url = %s', (product_url,))
                count = self.cur.fetchone()[0]
                        
                if count == 0:
                    try:
                        self.cur.execute('INSERT INTO product_urls (url, category) VALUES (%s, %s)', (product_url, category))
                        self.conn.commit() 
                        self.log(f"Inserted URL into DB: {product_url} in category: {category}", level=logging.INFO)
                        print(f"Inserted URL into DB: {product_url} in category: {category}")
                    except Exception as e:
                        self.logger.error(f"Error inserting into DB: {e}")
                        self.conn.rollback()

                else:
                    print(f"No target script found in URL: {response.url}")

        except Exception as e:
            self.logger.error(f"Error parsing response: {e}")
    



          

