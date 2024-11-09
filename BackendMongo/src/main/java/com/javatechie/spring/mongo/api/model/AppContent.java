package com.javatechie.spring.mongo.api.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "AppContent")
public class AppContent {
    String author;
    String configurationItems;
    String key;
    String layout;
    String name;
    int refreshInterval;

    public String getAuthor() {
        return author;
    }

    public String getConfigurationItems() {
        return configurationItems;
    }

    public String getKey() {
        return key;
    }

    public String getLayout() {
        return layout;
    }

    public String getName() {
        return name;
    }

    public int getRefreshInterval() {
        return refreshInterval;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setConfigurationItems(String configurationItems) {
        this.configurationItems = configurationItems;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRefreshInterval(int refreshInterval) {
        this.refreshInterval = refreshInterval;
    }
}
