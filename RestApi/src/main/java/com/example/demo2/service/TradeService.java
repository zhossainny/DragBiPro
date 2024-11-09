package com.example.demo2.service;

import com.example.demo2.dao.TradeDao;
import com.example.demo2.dto.TradeData;
import reactor.core.publisher.Flux;

public class TradeService {
    //@Autowired
    private TradeDao dao = new TradeDao();

    public Flux<TradeData> loadAllCustomersStream() {
        long start = System.currentTimeMillis();
        Flux<TradeData> trades = dao.getTradeDuo();
        long end = System.currentTimeMillis();
        System.out.println("Total execution time : " + (end - start));
        return trades;
    }
}

