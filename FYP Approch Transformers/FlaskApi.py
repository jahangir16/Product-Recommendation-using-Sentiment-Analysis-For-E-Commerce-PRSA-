from flask import Flask, request, jsonify
from transformers import DistilBertForSequenceClassification, AutoTokenizer
import torch
from sqlalchemy import ForeignKey, Text, create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all domains
#CORS(app)
#  CORS (Cross-Origin Resource Sharing) 
# Or, if you want to restrict it to specific origins:
CORS(app, resources={r"/analyze_reviews": {"origins": "http://localhost:5173"}})

DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/DarazProductsFinal"
engine = create_engine(DATABASE_URL)
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

# Define database models
class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    productname = Column(Text, unique=True)
    brandname = Column(Text)
    discountprice = Column(Text)
    originalprice = Column(Text)
    rating = Column(Text)
    category = Column(Text)
    producturl = Column(Text)
    image_urls = Column(Text)
    images = Column(Text)
    sentiment_analyzed = Column(Boolean, default=False)
    reviews = relationship('Review', back_populates='product')

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    review_content = Column(Text, unique=True)
    sentiment = Column(Text)
    product = relationship('Product', back_populates='reviews')

Base.metadata.create_all(engine)

# Load the model and tokenizer
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
Mymodel = DistilBertForSequenceClassification.from_pretrained('Transformer/fine_tuned_distilbert_sentiment_T2')
Mytokenizer = AutoTokenizer.from_pretrained('Transformer/fine_tuned_distilbert_sentiment_T2')
Mymodel.to(device)

def preprocess_review(review_text, tokenizer, max_length=512):
    inputs = tokenizer(review_text, padding=True, truncation=True, max_length=max_length, return_tensors="pt")
    inputs = {key: value.to(device) for key, value in inputs.items()}
    return inputs

def predict_sentiment(review_text):
    inputs = preprocess_review(review_text, Mytokenizer)
    with torch.no_grad():
        outputs = Mymodel(**inputs)
    logits = outputs.logits
    predictions = torch.argmax(logits, dim=1)
    return "Positive" if predictions.item() == 1 else "Negative"

@app.route('/analyze_reviews', methods=['POST'])
def analyze_reviews():
    product_id = request.json['product_id']
    product = session.query(Product).get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    

    reviews = session.query(Review).filter_by(product_id=product_id).all()
    if not reviews:
        product.sentiment_analyzed = True
        session.commit()
        return jsonify({"message": "No reviews found for this product"}), 200

    for review in reviews:
        sentiment = predict_sentiment(review.review_content)
        review.sentiment = sentiment
        session.commit()

    product.sentiment_analyzed = True
    session.commit()

    return jsonify({"message": "Sentiment analysis completed"}), 200

@app.route('/analyze_all_products', methods=['POST'])
def analyze_all_products():
    products = session.query(Product).filter_by(sentiment_analyzed=False).all()

    if not products:
        return jsonify({"message": "No products pending analysis"}), 200

    for product in products:
        reviews = session.query(Review).filter_by(product_id=product.id).all()

        for review in reviews:
            sentiment = predict_sentiment(review.review_content)
            review.sentiment = sentiment

        product.sentiment_analyzed = True
        session.commit()

    return jsonify({"message": "All products analyzed successfully"}), 200

# @app.route('/rank_products', methods=['GET'])
# def rank_products():
#     products = session.query(Product).filter_by(sentiment_analyzed=True).all()
#     product_sentiments = []
#     for product in products:
#         reviews = session.query(Review).filter_by(product_id=product.id).all()
#         positive_reviews = sum(1 for review in reviews if review.sentiment == "Positive")
#         total_reviews = len(reviews)
#         if total_reviews > 0:
#             sentiment_score = positive_reviews / total_reviews
#             product_sentiments.append((product, sentiment_score))

#     ranked_products = sorted(product_sentiments, key=lambda x: x[1], reverse=True)
#     ranked_product_list = [{"ProductName": product.productname, "SentimentScore": score,"ProductId":product.id} for product, score in ranked_products]

#     return jsonify(ranked_product_list), 200

# @app.route('/hybrid_rank_products', methods=['GET'])
# def hybrid_rank_products():
#     products = session.query(Product).filter_by(sentiment_analyzed=True).all()
#     product_scores = []
#     for product in products:
#         reviews = session.query(Review).filter_by(product_id=product.id).all()
#         positive_reviews = sum(1 for review in reviews if review.sentiment == "Positive")
#         total_reviews = len(reviews)
        
#         # Clean the rating string to ensure it can be converted to float
#         rating_str = product.rating if product.rating else "0.0"
#         rating_str = ''.join(filter(lambda x: x.isdigit() or x == '.', rating_str))
#         rating = float(rating_str) if rating_str else 0.0
        
#         # Clean the discountprice and originalprice strings to ensure they can be converted to float
#         def clean_price(price_str):
#             return ''.join(filter(lambda x: x.isdigit() or x == '.', price_str))
        
#         discountprice_str = clean_price(product.discountprice) if product.discountprice else "0.0"
#         originalprice_str = clean_price(product.originalprice) if product.originalprice else "0.0"
        
#         discount = float(discountprice_str) / float(originalprice_str) if discountprice_str and originalprice_str else 1.0
        
#         if total_reviews > 0:
#             sentiment_score = positive_reviews / total_reviews
#             final_score = (sentiment_score * 0.6) + (rating / 5 * 0.3) + (discount * 0.1)
#             product_scores.append({"ProductName": product.productname, "FinalScore": final_score, "ProductId": product.id})
    
#     ranked_products = sorted(product_scores, key=lambda x: x["FinalScore"], reverse=True)
#     return jsonify(ranked_products), 200

if __name__ == '__main__':
    app.run(debug=True)