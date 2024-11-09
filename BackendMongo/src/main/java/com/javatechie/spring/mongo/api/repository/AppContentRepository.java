package com.javatechie.spring.mongo.api.repository;

import com.javatechie.spring.mongo.api.model.AppContent;
import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppContentRepository extends MongoRepository<AppContent,String> {
    @Query("{ 'key': ?0 }")
    AppContent findByKey(@Param("key") String key);

    @DeleteQuery
    void deleteByKey(String key);
}
