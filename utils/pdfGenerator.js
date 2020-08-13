/**
 * To create header PDF
 * @param {object} doc
 * @param {string} intitulePdf 
 * @param {string} nomOrganisme 
 * @param logoOrganisme file
 */
exports.headerPdf = (doc, logoOrganisme, intitulePdf, nomOrganisme) => {
    doc.image(logoOrganisme, 60, 50, { width: 150 });
    doc.fontSize(14);
    doc
        .font('Helvetica-Bold')
        .text('FEUILLE D\'EMARGEMENT -> PERIODE DE FORMATION', 230, 65);

    doc.fontSize(8)

    doc
        .font('Helvetica-Bold')
        .text(`Intitulé : ${intitulePdf}`);

    doc
        .font('Helvetica-Bold')
        .text(`Organisme de formation : `);

    doc
        .font('Helvetica')
        .text(nomOrganisme, 340, 92);
}



/**
 * To create body PDF
 * @param {object} doc 
 * @param {number} xEntete 
 * @param {number} yEntete 
 * @param {number} xApprenant 
 * @param {number} yApprenant 
 * @param {Array} joursFormation 
 * @param {Array} apprenants 
 * @param {Array} formateur 
 */
exports.corpsPdf = (doc, xEntete, yEntete, xApprenant, yApprenant, joursFormation, apprenants, formateur, compteurInitPlage, compteurFinPlage) => {
    joursFormation.forEach(jour => {
        // the date
        doc.lineJoin('miter')
            .rect(xEntete, yEntete, 120, 22)
            .stroke()
            .font('Helvetica-Bold')
            .text(`Le ${jour}`, xEntete + 30, yEntete + 8);
        xEntete += 120;
    });

    doc.lineJoin('miter')
        .rect(xApprenant, yApprenant, 170, 30)
        .stroke()
        .font('Helvetica-Bold')
        .text(`NOM PRENOM Apprenant`, 60, 195);


    // Morning / afternoon
    for (let i = 0; i < 10; i++) {
        doc.fontSize(6);
        if (i % 2 == 0) {
            doc.lineJoin('miter')
                .rect(200 + (60 * i), yApprenant, 60, 30)
                .stroke()
                .font('Helvetica-Bold')
                .text('MATIN', 205 + (60 * i), yApprenant + 8, { width: 60, align: 'left' })
                .text('Durée en h : 4', 205 + (60 * i), yApprenant + 16, { width: 60, align: 'left' });
        } else {
            doc.lineJoin('miter')
                .rect(200 + (60 * i), yApprenant, 60, 30)
                .stroke()
                .font('Helvetica-Bold')
                .text('APRES-MIDI', 205 + (60 * i), yApprenant + 8, { width: 60, align: 'left' })
                .text('Durée en h : 3', 205 + (60 * i), yApprenant + 16, { width: 60, align: 'left' });
        }
    }

    for (let m = compteurInitPlage; m < compteurFinPlage; m++){
        // learner's identity
        if (apprenants[m]) {
            doc.fontSize(7);

            doc.lineJoin('miter')
                .rect(xApprenant, yApprenant + 30, 170, 40)
                .stroke()
                .font('Helvetica-Bold')
                .text(`${apprenants[m]}`, xApprenant + 8, yApprenant + 48);

            // signature location
            for (let j = 0; j < 10; j++) {
                doc.lineJoin('miter')
                    .rect(xApprenant + (170 + 60 * j), yApprenant + 30, 60, 40)
                    .stroke()
            }
            yApprenant += 40;
        }
    }

    // trainer's identity
    for (let k = 0; k < formateur.length; k++) {
        doc.fontSize(8);
        doc.lineJoin('miter')
            .rect(xApprenant + 170 + (120 * k), yApprenant + 30, 120, 60)
            .stroke()
            .font('Helvetica-Bold')
            .text('NOM Prénom formateur.rice', xApprenant + 170 + (120 * k), yApprenant + 38, { width: 120, align: 'center' })
            .text(`${formateur[k]}`, xApprenant + 170 + (120 * k), yApprenant + 58, { width: 120, align: 'center' });
    }

    doc.lineJoin('miter')
        .rect(xApprenant + 550, yApprenant + 110, 220, 80)
        .stroke()
        .font('Helvetica')
        .text(`Cachet organisme de formation :`, 585, yApprenant + 118);
}