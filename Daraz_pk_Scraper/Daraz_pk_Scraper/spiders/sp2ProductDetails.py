import scrapy
from selenium import webdriver
from scrapy.selector import Selector
import time
import pprint
import psycopg2
from Daraz_pk.items import DarazPkItem
from scrapy.http import TextResponse
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging

class DarazSpider(scrapy.Spider):
    name = "daraz_spider123"
    allowed_domains = ["daraz.pk"]

    def __init__(self, *args, **kwargs):
        super(DarazSpider, self).__init__(*args, **kwargs)
        self.driver = None
        self.conn = None
        self.cur = None
        self.last_url = None
        pprint.pprint("SartingSpider********************************")

    def start_requests(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.conn = psycopg2.connect(database="DarazProductsFinal", user="postgres", password="123456", host="localhost")
        self.cur = self.conn.cursor()

        try:
            
                self.cur.execute('SELECT url, category FROM product_urls WHERE processed = FALSE LIMIT 1')
                product_url, category = self.cur.fetchone()

                self.logger.info(f"Processing URL: {product_url}")
                yield scrapy.Request(url=product_url, callback=self.parse, meta={'category': category, 'product_url': product_url})

        except Exception as e:
            self.logger.error(f"Error processing URL: {e}")


    def parse(self, response):
        try:
           pprint.pprint("parse********************************")

           product_url = response.meta['product_url']
           category = response.meta['category']

           self.driver.get(product_url)
           time.sleep(3)
        
           body = self.driver.page_source
           scrapy_response = TextResponse(url=response.url, body=body, encoding='utf-8')
           item = DarazPkItem()
           item['Productname'] = scrapy_response.css('h1.pdp-mod-product-badge-title::text').getall()
           item['BrandName'] = scrapy_response.css('a.pdp-product-brand__brand-link::text').getall()
           item['DiscountPrice'] = scrapy_response.css('span.pdp-price_size_xl::text').getall()
           item['OriginalPrice'] = scrapy_response.css('span.pdp-price_size_xs::text').getall()

           
           
           raw_image_urls = scrapy_response.css('img.gallery-preview-panel__image::attr(src)').getall()
           url = scrapy_response.url
           item['Category'] = category
           item['ProductUrl'] = url    
           clean_image_urls = [scrapy_response.urljoin(image_url) for image_url in raw_image_urls]
           item['image_urls'] = clean_image_urls
           item['images'] = []
# Find Rating
           driver = self.driver
        
           while True:
            # Scroll 65 pixels down
                driver.execute_script("window.scrollBy(0, 65);")
                time.sleep(1)  # wait for 1 second to let page content load

        # Capture the page source after scrolling
                page_source = driver.page_source

        # Parse the page source with Scrapy's Selector
                selector = Selector(text=page_source)
                self.log(f"Finding Rating********", level=logging.INFO)

        # Look for the rating span (with class 'score')
                rating = selector.css('div.score span.score-average::text').get()

                if rating:
                 # If the rating is found, store it and stop the scrolling
                 item['Rating'] = rating
                 print(f"Rating found: {rating}")
                 break

           
       #Find Reviews
           all_reviews = []
           empty_reviews = 0
           last_page_reviews = None

           while True:
                
                driver.execute_script("window.scrollBy(0, 50);")
                time.sleep(1)
                page_source = driver.page_source

                # Parse the page source with Selector
                selector = Selector(text=page_source)
                self.log(f"*******Finding Review", level=logging.INFO)

                # Check for the "mod-empty" element
                if selector.css('.mod-empty .empty-text::text').get() == "This product has no reviews.":
                    self.log("No reviews found. Stopping the scraping process.", level=logging.INFO)
                    break
    
                # Extract review items based on your HTML structure
                review_items = selector.css('.mod-reviews .item')
                self.log(f"Found {len(review_items)} review items", level=logging.INFO)
                # Using list comprehension to directly extract all review text

                reviews = [
                    item.css('.item-content .content::text').get()
                         for item in review_items
                            ]

                # Optionally filter out any empty reviews (if necessary)
                reviews = [review for review in reviews if review] 

                 # If the review text is not empty, add it to the reviews list
                if reviews:
                   all_reviews.extend(reviews)
                   self.logger.info(f"Found {len(all_reviews)} reviews for this product.")

                else:
                    empty_reviews += 1

                # Check if we have empty reviews or if reviews are the same as the last page
                if empty_reviews >= 1 or all(not review for review in reviews) or (last_page_reviews is not None and last_page_reviews == reviews):
                 break

                # Extend all_reviews with new reviews from this page
                #all_reviews.extend(reviews)
                try:
                                        
                      # Look for the next button and wait for it to be clickable button.next-btn.next-pagination-item.next
                            next_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, "button.next-btn.next-pagination-item.next"))
                            )
                
    
                            # If the 'Next Page' button is disabled, stop scraping
                            if next_button.get_attribute("disabled") is not None:
                                self.log(f"Next page button is disabled. Stopping the scraping process.", level=logging.INFO)
                                break

                # Wait before clicking the next button to avoid quick successive requests
                            time.sleep(3)
    
                # Click the 'Next Page' button and wait for the page to load
                            next_button.click()
                            time.sleep(2)
                    
                        
                except Exception as e:
                    self.logger.error(f"Error clicking next button: {e}")
                    break
    
                # Set last_page_reviews to the current reviews for comparison in the next iteration
                last_page_reviews = reviews

                # Store the collected reviews in your item



           # Check if the all_reviews are empty or not
           if not all_reviews:
               self.logger.info("No reviews found for this product.")
           else:
               self.logger.info(f"Found {len(all_reviews)} reviews for this product.")
           item['reviews'] = all_reviews
           yield item
           print("Item is yielded")
           self.cur.execute('UPDATE product_urls SET processed = TRUE WHERE url = %s', (product_url,))
           self.conn.commit()
           self.logger.info(f"Marked URL as processed: {product_url}")
           self.last_url = product_url
           self.logger.info(f"Updated last_url to: {self.last_url}")

           self.logger.info("Calling fetch_next_url")

           # Then call a new method to fetch the next URL
           yield from self.fetch_next_url()


        except Exception as e:
            self.logger.error(f"Error parsing response: {e}")

        

    def fetch_next_url(self):
        self.logger.info("Inside fetch_next_url")
        # Fetch the next URL from the database
        self.cur.execute('SELECT url, category FROM product_urls WHERE processed = FALSE LIMIT 1')
        #self.cur.execute('SELECT url, category FROM product_urls WHERE processed = FALSE AND category = %s LIMIT 1', ('computing-peripherals-accessories',))
        row = self.cur.fetchone()

        if row is not None:
            product_url, category = row
            # Send a new request for the next URL
            yield scrapy.Request(url=product_url, callback=self.parse, meta={'category': category, 'product_url': product_url})
        else:
            self.logger.info("No more URLs to process")
            self.cur.close()
            self.conn.close()

    def closed(self, reason):
        print("Spider closed with reason:", reason)
