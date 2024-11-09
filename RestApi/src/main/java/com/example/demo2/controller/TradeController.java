package com.example.demo2.controller;

import com.example.demo2.dto.TradeData;
import com.example.demo2.service.TradeService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@Service
@RequestMapping("/trades")
public class TradeController {

    //@Autowired
    private TradeService service = new TradeService();

    @GetMapping(value = "/stream",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<TradeData> getAllTradesStream(){
        return service.loadAllCustomersStream();
    }

}
