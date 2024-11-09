package com.javatechie.spring.mongo.api.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
public class Tag {
    boolean containsLocalData;
    boolean shared;
    String tag;
    String updatedBy;
    Date timestamp;
    public Tag(){}

    public boolean isContainsLocalData() {
        return containsLocalData;
    }

    public boolean isShared() {
        return shared;
    }

    public String getTag() {
        return tag;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setContainsLocalData(boolean containsLocalData) {
        this.containsLocalData = containsLocalData;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
