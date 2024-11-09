package com.javatechie.spring.mongo.api.resource;

import com.javatechie.spring.mongo.api.model.AppContent;
import com.javatechie.spring.mongo.api.repository.AppContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class AppContentController {

    @Autowired
    private AppContentRepository repository;

    @PostMapping("/api/v1/appContent")
    public ResponseEntity<Object> saveappContent(@RequestBody AppContent appCont) {
        if(appCont.getAuthor().contains("null"))
            appCont.setAuthor("Demouser");
        AppContent exContent = repository.findByKey(appCont.getKey());
        if(exContent!=null){
            repository.deleteByKey(exContent.getKey());
        }
        repository.save(appCont);
        return new ResponseEntity<Object>("OK", HttpStatus.OK);
    }

    @CrossOrigin(origins = "*",allowedHeaders = "*")
    @GetMapping("/api/v1/appContent/{key}")
    public AppContent getappInfo(@PathVariable String key) {
        return repository.findByKey(key);
    }

    @DeleteMapping("/api/v1/appContent/delete/{key}")
    public String deleteappInfo(@PathVariable String key) {
        repository.deleteById(key);
        return "AppCOntent deleted with key : " + key;
    }

}
