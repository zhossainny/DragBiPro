package com.example.demo2;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.io.File;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.example.demo2.Utilities.convertCSVtoJson;
import static com.example.demo2.Utilities.convertTradeDataCSVtoJson;


@CrossOrigin(origins = "*")
@RestController
public class StockController {

    @CrossOrigin(origins = "*", allowCredentials = "true", allowedHeaders = "*")
    @GetMapping("/timeseries/stockprice")
    public ResponseEntity<Object> sayTest(@RequestParam("sym") String sym){
        try{
            System.out.println("Sym is : "+sym );
            String filename = "Data/Stocks/"+sym+".us.txt";

            return convertCSVtoJson(filename);
        }catch (Exception ex){
            return new ResponseEntity<Object>(ex.toString(),HttpStatus.BAD_REQUEST);
        }

    }
    @CrossOrigin(origins = "*", allowCredentials = "true", allowedHeaders = "*")
    @GetMapping("/tradedata")
    public ResponseEntity<Object> sayTest2(){
        try{
            //System.out.println("Sym is : "+sym );
            //String filename = "Data/Stocks/"+sym+".us.txt";
            String filename = "C:\\Users\\ahmte\\IdeaProjects\\BofaTrade\\tradedata.csv";
            return  convertTradeDataCSVtoJson(filename);
        }catch (Exception ex){
            return new ResponseEntity<Object>(ex.toString(),HttpStatus.BAD_REQUEST);
        }

    }
//    private ResponseEntity<Object> convertCSVtoJson(String filePrefix) throws Exception {
//        Pattern pattern = Pattern.compile(",");
//        try (BufferedReader in = new BufferedReader(new FileReader("Data\\Stocks\\"+filePrefix+".us.txt"))) {
//            List<Player> players = in.lines().skip(1).map(line -> {
//                String[] x = pattern.split(line);
//                return new Player(x[0], Double.parseDouble(x[1]),Double.parseDouble(x[2]), Double.parseDouble(x[3]), Double.parseDouble(x[4]),Double.parseDouble(x[5]),Double.parseDouble(x[6]));
//            }).collect(Collectors.toList());
//            ObjectMapper mapper = new ObjectMapper();
//            mapper.enable(SerializationFeature.INDENT_OUTPUT);
//            //mapper.writeValue(System.out, players);
//            String s = mapper.writeValueAsString(players);
//            s = "{ \"root\": "+s+"}";
//            return new ResponseEntity<Object>(s,HttpStatus.OK);
//        }
//    }
}
