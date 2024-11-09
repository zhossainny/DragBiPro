package com.example.demo2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
public class SalesController {


    @CrossOrigin(origins = "*", allowCredentials = "true", allowedHeaders = "*")
    @GetMapping("/sales/salesample1")
    public ResponseEntity<String> salessample1(){
        try{
            String content = new String(Files.readAllBytes(Paths.get("Data/SalesController.json")));
            return new ResponseEntity<String>(content,HttpStatus.OK);
        }catch (Exception ex){
            return  new ResponseEntity<String>(ex.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin(origins = "*", allowCredentials = "true", allowedHeaders = "*")
    @GetMapping("/generic/path")
    public ResponseEntity<String> GenericCSVFileToJson(@RequestParam("name") String fileName){
        try{
            fileName = fileName.replaceAll(".json","");
            String content = new  String(Files.readAllBytes(Paths.get("C:\\zahid\\DragBi\\Data\\"+fileName+".json")));
            return new ResponseEntity<String>(content,HttpStatus.OK);
        }catch (Exception ex){
            return  new ResponseEntity<String>(ex.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}
