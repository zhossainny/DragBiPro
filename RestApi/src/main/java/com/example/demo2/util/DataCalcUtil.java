package com.example.demo2.util;

import com.example.demo2.dto.TradeData;

import java.util.Collections;
import java.util.PriorityQueue;

public class DataCalcUtil {
    //PriorityQueue - Max Heap to be sorted always to retrieve the largest trade from the top with complexity O(1). (Red-Black tree sort). Sorting complexity O(NlogN)
    public static final PriorityQueue<TradeData> pQueue = new PriorityQueue<>(Collections.reverseOrder());

    public static Double getAverageBySymbol(String sym){
        double sum=0;
        int totaltrade = 0;
        for(Object o: pQueue.stream().filter(x->x.Symbol.contains(sym)).toArray()){
            TradeData td = (TradeData)o;
            totaltrade +=td.Size;
            sum+=td.Price*td.Size;
        }
        Double average = sum/totaltrade;
        return Math.round(average*100.0)/100.0;
    }
    public static Long NumberOfTradesBySymbolStatus(String symbol,String status){
        return pQueue.stream().filter(x->x.Symbol.contains(symbol) && x.Status.contains(status)).count();
    }

    public static TradeData LargestTradeBySize(){
        return pQueue.peek();
    }
}
