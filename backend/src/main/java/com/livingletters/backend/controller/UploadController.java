package com.livingletters.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/v1/upload")
@RequiredArgsConstructor
@Tag(name = "Upload", description = "Upload d'images vers Cloudinary")
public class UploadController {

    private final Cloudinary cloudinary;

    @PostMapping
    @Operation(summary = "Upload une image")
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le fichier est vide"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Seules les images sont acceptees"));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "living-letters",
                "resource_type", "image",
                "transformation", "w_800,q_auto,f_auto"
            )
        );

        return ResponseEntity.ok(Map.of(
            "url", result.get("secure_url"),
            "publicId", result.get("public_id"),
            "width", result.get("width"),
            "height", result.get("height")
        ));
    }

    @DeleteMapping("/{publicId}")
    @Operation(summary = "Supprimer une image de Cloudinary")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        return ResponseEntity.ok(Map.of("status", "deleted"));
    }
}
