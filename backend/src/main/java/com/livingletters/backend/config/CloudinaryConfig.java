package com.livingletters.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${CLOUDINARY_URL:}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudinaryUrl != null && !cloudinaryUrl.isEmpty() && !cloudinaryUrl.contains("<your_")) {
            try {
                return new Cloudinary(cloudinaryUrl);
            } catch (Exception e) {
                log.warn("CLOUDINARY_URL invalide, upload désactivé: {}", e.getMessage());
            }
        }
        log.warn("CLOUDINARY_URL non configuré, upload désactivé");
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "demo",
            "api_key", "",
            "api_secret", ""
        ));
    }
}
