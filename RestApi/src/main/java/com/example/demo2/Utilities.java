package com.example.demo2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Utilities {

    public static ResponseEntity<Object> convertCSVtoJson(String filename) throws Exception {
        Pattern pattern = Pattern.compile(",");
        try (BufferedReader in = new BufferedReader(new FileReader(filename))) {
            List<Player> players = in.lines().skip(1).map(line -> {
                String[] x = pattern.split(line);
                return new Player(x[0], Double.parseDouble(x[1]),Double.parseDouble(x[2]), Double.parseDouble(x[3]), Double.parseDouble(x[4]),Double.parseDouble(x[5]),Double.parseDouble(x[6]));
            }).collect(Collectors.toList());
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            //mapper.writeValue(System.out, players);
            String s = mapper.writeValueAsString(players);
            s = "{ \"root\": "+s+"}";
            return new ResponseEntity<Object>(s,HttpStatus.OK);
        }
    }
    public static ResponseEntity<Object> convertTradeDataCSVtoJson(String filename) throws Exception {
        Pattern pattern = Pattern.compile(",");
        try (BufferedReader in = new BufferedReader(new FileReader(filename))) {
            List<TradeData1> players = in.lines().skip(1).map(line -> {
                String[] x = pattern.split(line);
                return new TradeData1(x[0].replace("\"",""), x[1].replace("\"",""),x[2].replace("\"",""), Integer.parseInt(x[3].replace("\"","")), Double.parseDouble(x[4].replace("\"","")),x[5].replace("\"",""),x[6].replace("\"",""));
            }).collect(Collectors.toList());
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            //mapper.writeValue(System.out, players);
            String s = mapper.writeValueAsString(players);
            s = "{ \"root\": "+s+"}";
            return new ResponseEntity<Object>(s,HttpStatus.OK);
        }
    }
}
