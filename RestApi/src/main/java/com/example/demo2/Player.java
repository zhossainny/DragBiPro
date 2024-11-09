package com.example.demo2;

public class Player {
    String Date; Double Open; Double High; Double Low; Double Close; Double Volume; Double OpenInt;
    public Player(String Date, Double Open, Double High, Double Low, Double Close, Double Volume, Double OpenInt) {
        this.Date = Date;
        this.Open = Open;
        this.High = High;
        this.Low = Low;
        this.Close = Close;
        this.Volume = Volume;
        this.OpenInt = OpenInt;
    }

    public String getDate() {
        return Date;
    }

    public Double getOpen() {
        return Open;
    }

    public Double getHigh() {
        return High;
    }

    public Double getLow() {
        return Low;
    }

    public Double getClose() {
        return Close;
    }

    public Double getVolume() {
        return Volume;
    }

    public Double getOpenInt() {
        return OpenInt;
    }

    public void setDate(String date) {
        Date = date;
    }

    public void setOpen(Double open) {
        Open = open;
    }

    public void setHigh(Double high) {
        High = high;
    }

    public void setLow(Double low) {
        Low = low;
    }

    public void setClose(Double close) {
        Close = close;
    }

    public void setVolume(Double volume) {
        Volume = volume;
    }

    public void setOpenInt(Double openInt) {
        OpenInt = openInt;
    }
    // getters and setters here
};