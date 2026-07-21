package com.livingletters.backend.service;

import com.livingletters.backend.dto.FactureDTO;
import com.livingletters.backend.exception.ConflictException;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.FactureMapper;
import com.livingletters.backend.model.*;
import com.livingletters.backend.repository.CommandeRepository;
import com.livingletters.backend.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FactureService {

    private final FactureRepository factureRepository;
    private final CommandeRepository commandeRepository;
    private final FactureMapper factureMapper;

    @Transactional(readOnly = true)
    public List<FactureDTO> getAll(String email, Role role) {
        if (role == Role.ADMIN) {
            return factureRepository.findAll().stream()
                    .map(factureMapper::toDTO)
                    .collect(Collectors.toList());
        }
        return factureRepository.findByCommandeUtilisateurEmail(email).stream()
                .map(factureMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FactureDTO getById(Long id, String email, Role role) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture", id));
        if (role != Role.ADMIN && !facture.getCommande().getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Facture", id);
        }
        return factureMapper.toDTO(facture);
    }

    @Transactional
    public synchronized FactureDTO generer(Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", commandeId));

        if (commande.getFacture() != null) {
            throw new ConflictException("Une facture existe déjà pour cette commande");
        }

        String numFacture = genererNumFacture();

        Facture facture = Facture.builder()
                .date(LocalDate.now())
                .heure(LocalTime.now())
                .numFacture(numFacture)
                .commande(commande)
                .build();

        facture = factureRepository.save(facture);
        return factureMapper.toDTO(facture);
    }

    @Transactional(readOnly = true)
    public byte[] downloadPdf(Long id, String email, Role role) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture", id));

        if (role != Role.ADMIN && !facture.getCommande().getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Facture", id);
        }

        Commande commande = facture.getCommande();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PDDocument document = new PDDocument()) {

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
                cs.setLeading(24);
                cs.newLineAtOffset(50, 750);
                cs.showText("LIVING LETTERS");
                cs.newLine();
                cs.setFont(PDType1Font.HELVETICA, 12);
                cs.showText("Facture N" + facture.getNumFacture());
                cs.newLine();
                cs.newLine();
                cs.showText("Date: " + facture.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                cs.newLine();
                cs.showText("Heure: " + facture.getHeure().format(DateTimeFormatter.ofPattern("HH:mm")));
                cs.newLine();
                cs.newLine();
                cs.showText("Commande #" + commande.getId());
                cs.newLine();
                cs.showText("Statut: " + commande.getStatut().name());
                cs.newLine();
                cs.newLine();

                if (commande.getLignes() != null) {
                    cs.setFont(PDType1Font.HELVETICA_BOLD, 12);
                    cs.showText("Articles:");
                    cs.newLine();
                    cs.setFont(PDType1Font.HELVETICA, 11);
                    for (LigneCommande ligne : commande.getLignes()) {
                        String nomLivre = ligne.getLivre() != null ? ligne.getLivre().getNom() : "N/A";
                        String line = String.format("  - %s x%d @ %s FCFA",
                                nomLivre, ligne.getQte(), ligne.getPrixUnitaire());
                        cs.showText(line);
                        cs.newLine();
                    }
                }

                cs.newLine();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
                cs.showText("Total: " + commande.getMontantTotal() + " FCFA");
                cs.newLine();
                cs.newLine();
                cs.setFont(PDType1Font.HELVETICA, 10);
                cs.showText("Merci pour votre achat chez Living Letters!");
                cs.endText();
            }

            document.save(baos);
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    private synchronized String genererNumFacture() {
        int year = LocalDate.now().getYear();
        String prefix = String.format("LL-%d-", year);
        Long maxSequence = factureRepository.findMaxSequenceByPrefix(prefix);
        long nextSequence = (maxSequence != null ? maxSequence : 0) + 1;
        return String.format("LL-%d-%05d", year, nextSequence);
    }
}
