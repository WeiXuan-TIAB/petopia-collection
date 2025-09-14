#!/bin/bash

echo "🔄 統一圖片格式為 PNG..."

# 餐廳圖片統一處理
echo "🍽️ 處理餐廳圖片..."
cd public/images/map/places/mainphoto/restaurant/

# 處理所有檔案，統一為 PNG 格式
for i in {1..50}; do
    # 檢查各種可能的檔案名
    if [ -f "placerestaurant$i" ]; then
        echo "重命名: placerestaurant$i -> placerestaurant$i.png"
        mv "placerestaurant$i" "placerestaurant$i.png"
    elif [ -f "placerestaurant$i.jpg" ]; then
        echo "重命名: placerestaurant$i.jpg -> placerestaurant$i.png"
        mv "placerestaurant$i.jpg" "placerestaurant$i.png"
    elif [ ! -f "placerestaurant$i.png" ]; then
        echo "創建: placerestaurant$i.png"
        cp ../../default.png "placerestaurant$i.png"
    fi
done

cd - > /dev/null

# 對其他目錄執行相同操作
echo "🌳 處理公園圖片..."
cd public/images/map/places/mainphoto/park/
for i in {1..30}; do
    if [ -f "placepark$i" ]; then
        mv "placepark$i" "placepark$i.png"
    elif [ -f "placepark$i.jpg" ]; then
        mv "placepark$i.jpg" "placepark$i.png"
    elif [ ! -f "placepark$i.png" ]; then
        cp ../../default.png "placepark$i.png"
    fi
done
cd - > /dev/null

echo "💄 處理美容院圖片..."
cd public/images/map/places/mainphoto/salon/
for i in {1..30}; do
    if [ -f "placesalon$i" ]; then
        mv "placesalon$i" "placesalon$i.png"
    elif [ -f "placesalon$i.jpg" ]; then
        mv "placesalon$i.jpg" "placesalon$i.png"
    elif [ ! -f "placesalon$i.png" ]; then
        cp ../../default.png "placesalon$i.png"
    fi
done
cd - > /dev/null

echo "🏨 處理旅館圖片..."
cd public/images/map/places/mainphoto/hotel/
for i in {1..25}; do
    if [ -f "placehotel$i" ]; then
        mv "placehotel$i" "placehotel$i.png"
    elif [ -f "placehotel$i.jpg" ]; then
        mv "placehotel$i.jpg" "placehotel$i.png"
    elif [ ! -f "placehotel$i.png" ]; then
        cp ../../default.png "placehotel$i.png"
    fi
done
cd - > /dev/null

echo "🏥 處理醫院圖片..."
cd public/images/map/places/mainphoto/hospital/
for i in {1..25}; do
    if [ -f "placehospital$i" ]; then
        mv "placehospital$i" "placehospital$i.png"
    elif [ -f "placehospital$i.jpg" ]; then
        mv "placehospital$i.jpg" "placehospital$i.png"
    elif [ ! -f "placehospital$i.png" ]; then
        cp ../../default.png "placehospital$i.png"
    fi
done
cd - > /dev/null

echo "🐕 處理寵物店長圖片..."
cd public/images/map/places/mainphoto/pet/
for i in {1..15}; do
    if [ -f "placepet$i" ]; then
        mv "placepet$i" "placepet$i.png"
    elif [ -f "placepet$i.jpg" ]; then
        mv "placepet$i.jpg" "placepet$i.png"
    elif [ ! -f "placepet$i.png" ]; then
        cp ../../default.png "placepet$i.png"
    fi
done
cd - > /dev/null

echo "🛍️ 處理用品店圖片..."
cd public/images/map/places/mainphoto/store/
for i in {1..15}; do
    if [ -f "placestore$i" ]; then
        mv "placestore$i" "placestore$i.png"
    elif [ -f "placestore$i.jpg" ]; then
        mv "placestore$i.jpg" "placestore$i.png"
    elif [ ! -f "placestore$i.png" ]; then
        cp ../../default.png "placestore$i.png"
    fi
done
cd - > /dev/null

echo "🏛️ 處理公用設施圖片..."
cd public/images/map/places/mainphoto/publicutilities/
for i in {1..25}; do
    if [ -f "placepublicutilities$i" ]; then
        mv "placepublicutilities$i" "placepublicutilities$i.png"
    elif [ -f "placepublicutilities$i.jpg" ]; then
        mv "placepublicutilities$i.jpg" "placepublicutilities$i.png"
    elif [ ! -f "placepublicutilities$i.png" ]; then
        cp ../../default.png "placepublicutilities$i.png"
    fi
done
cd - > /dev/null

echo "🦎 處理特寵友善圖片..."
cd public/images/map/places/mainphoto/exoticpet/
for i in {1..15}; do
    if [ -f "placeexoticpet$i" ]; then
        mv "placeexoticpet$i" "placeexoticpet$i.png"
    elif [ -f "placeexoticpet$i.jpg" ]; then
        mv "placeexoticpet$i.jpg" "placeexoticpet$i.png"
    elif [ ! -f "placeexoticpet$i.png" ]; then
        cp ../../default.png "placeexoticpet$i.png"
    fi
done
cd - > /dev/null

echo ""
echo "🎉 完成！所有圖片已統一為 PNG 格式"
echo ""
echo "📊 檢查結果："
echo "餐廳圖片數量: $(ls public/images/map/places/mainphoto/restaurant/*.png 2>/dev/null | wc -l)"
echo "公園圖片數量: $(ls public/images/map/places/mainphoto/park/*.png 2>/dev/null | wc -l)"
echo "美容圖片數量: $(ls public/images/map/places/mainphoto/salon/*.png 2>/dev/null | wc -l)"
echo "旅館圖片數量: $(ls public/images/map/places/mainphoto/hotel/*.png 2>/dev/null | wc -l)"
echo "醫院圖片數量: $(ls public/images/map/places/mainphoto/hospital/*.png 2>/dev/null | wc -l)"
echo "寵物圖片數量: $(ls public/images/map/places/mainphoto/pet/*.png 2>/dev/null | wc -l)"
echo "用品圖片數量: $(ls public/images/map/places/mainphoto/store/*.png 2>/dev/null | wc -l)"
echo "設施圖片數量: $(ls public/images/map/places/mainphoto/publicutilities/*.png 2>/dev/null | wc -l)"
echo "特寵圖片數量: $(ls public/images/map/places/mainphoto/exoticpet/*.png 2>/dev/null | wc -l)"
