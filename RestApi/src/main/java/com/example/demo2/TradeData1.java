package com.example.demo2;

public class TradeData1 {
    public TradeData1(String security, String side, String account, int tradeQty, double tradePrice, String tradeReference, String description) {
        this.security = security;
        this.side = side;
        this.account = account;
        this.tradeQty = tradeQty;
        this.tradePrice = tradePrice;
        this.tradeReference = tradeReference;
        this.description = description;
    }

    public TradeData1() {
    }

    public String getSecurity() {
        return security;
    }

    public String getSide() {
        return side;
    }

    public String getAccount() {
        return account;
    }

    public int getTradeQty() {
        return tradeQty;
    }

    public double getTradePrice() {
        return tradePrice;
    }

    public String getTradeReference() {
        return tradeReference;
    }

    public String getDescription() {
        return description;
    }

    public void setSecurity(String security) {
        this.security = security;
    }

    public void setSide(String side) {
        this.side = side;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public void setTradeQty(int tradeQty) {
        this.tradeQty = tradeQty;
    }

    public void setTradePrice(double tradePrice) {
        this.tradePrice = tradePrice;
    }

    public void setTradeReference(String tradeReference) {
        this.tradeReference = tradeReference;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private String security;
    private String side;
    private String account;
    private int tradeQty;
    private double tradePrice;
    private String tradeReference;
    private String description;
}

