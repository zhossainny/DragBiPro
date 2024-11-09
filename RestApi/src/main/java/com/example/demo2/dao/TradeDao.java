package com.example.demo2.dao;

import com.example.demo2.Builder.TradeDataBuilder;
import com.example.demo2.dto.TradeData;
import com.example.demo2.util.DataCalcUtil;
import reactor.core.publisher.Flux;

import java.time.Duration;

public class TradeDao {

    public Flux<TradeData> getTradeDuo()  {
        new TradeData(1,"ABC",100,200,"X");
        return Flux.range(1,1000)
                //.delayElements(Duration.ofMillis(1))
                .doOnNext(i -> System.out.println("processing count in stream flow : " + i))
                .map(i -> buildTradeData());
    }
    private TradeData buildTradeData(){
        TradeDataBuilder builder = new TradeDataBuilder();
        TradeData td = builder.Build();
        DataCalcUtil.pQueue.add(td);
        return td;
    }
}
