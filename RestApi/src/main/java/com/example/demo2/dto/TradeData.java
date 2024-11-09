package com.example.demo2.dto;

public class TradeData implements Comparable<TradeData>{
    public int TimeStamp;
    public String Symbol;
    public double Price;
    public int Size;
    public String Status;

    public TradeData(int timeStamp, String symbol, double price, int size, String status) {
        TimeStamp = timeStamp;
        Symbol = symbol;
        Price = price;
        Size = size;
        Status = status;
    }
    public TradeData(){

    }

    public int getTimeStamp() {
        return TimeStamp;
    }

    public String getSymbol() {
        return Symbol;
    }

    public double getPrice() {
        return Price;
    }

    public int getSize() {
        return Size;
    }

    public String getStatus() {
        return Status;
    }

    public void setTimeStamp(int timeStamp) {
        TimeStamp = timeStamp;
    }

    public void setSymbol(String symbol) {
        Symbol = symbol;
    }

    public void setPrice(double price) {
        Price = price;
    }

    public void setSize(int size) {
        Size = size;
    }

    public void setStatus(String status) {
        Status = status;
    }

    @Override
    public int compareTo(TradeData o) {
        return this.Size-o.Size;
    }


}