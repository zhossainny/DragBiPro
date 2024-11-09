package com.example.demo2.Builder;

import com.example.demo2.dto.TradeData;

import java.util.Random;

public class TradeDataBuilder {

    public TradeData Build(){
        TradeData data = new TradeData();
        data.setTimeStamp(BuildTimeStamp());
        data.setSymbol(BuildSymbol());
        data.setPrice(BuildPrice());
        data.setSize(BuildSize());
        data.setStatus(BuildStatus());
        return data;
    }

    private int BuildTimeStamp(){
        long temp = System.currentTimeMillis()/1000;
        return (int)temp;
    }
    private String BuildSymbol(){
        String alphabet = "BCYZ";
        Random r = new Random();
        char[] c = new char[]{r.nextBoolean()?'X':'A',alphabet.charAt(r.nextInt(alphabet.length())),alphabet.charAt(r.nextInt(alphabet.length()))};
        return new String(c);
    }
    private double BuildPrice(){
        Random rd = new Random();
        double num = rd.nextDouble();
        return Math.round(num*100.0)/100.0;
    }
    private int BuildSize(){
        Random rd = new Random();
        return rd.nextInt();
    }
    private String BuildStatus(){
        String alphabet = "ABCDEXYZ";
        Random r = new Random();
        return String.valueOf(alphabet.charAt(r.nextInt(alphabet.length())));
    }

}
