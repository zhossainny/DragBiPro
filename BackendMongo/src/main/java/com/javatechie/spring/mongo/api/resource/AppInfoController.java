package com.javatechie.spring.mongo.api.resource;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.javatechie.spring.mongo.api.model.AppInfo;
import com.javatechie.spring.mongo.api.repository.AppInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class AppInfoController {

    @Autowired
    private AppInfoRepository repository;

    @PostMapping("/api/v1/apps")
    public ResponseEntity<Object> saveappInfo(@RequestBody AppInfo appInfo) {
        String s = appInfo.getDescription().replace("null (null)","demouser");
        appInfo.setDescription(s);
        AppInfo exInfo = repository.findByKey(appInfo.getKey());
        if(exInfo!=null){
            repository.deleteByKey(exInfo.getKey());
        }
        repository.save(appInfo);
        return new ResponseEntity<Object>("OK", HttpStatus.OK);
    }

    @GetMapping("/api/v1/apps")
    public List<AppInfo> getAppInfo() {

        return repository.findAll();
    }

    @CrossOrigin(origins = "*",allowedHeaders = "*")
    @GetMapping("/api/v1/apps/{key}")
    public AppInfo getappInfo(@PathVariable String key) {

        return repository.findByKey(key);
    }

    @DeleteMapping("/api/v1/apps/delete/{key}")
    public String deleteappInfo(@PathVariable String key) {
        repository.deleteById(key);
        return "appInfo deleted with key : " + key;
    }
}
