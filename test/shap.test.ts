import { ShapPlot } from '../src/plots/shap';

describe('ShapPlot Integration Test', () => {
  it('renders an SVG with cells', () => {
    document.body.innerHTML = '<div id="plot-container"></div>';
    // Create and draw the plot
    const plot = new ShapPlot({
      elementId: '#plot-container',
      baseValue: -10.256918907165527,
      modelOutputScore: {
        conservationScoreDGV: -0.02730652503669262,
        gnomadAF: -0.3869878053665161,
        gnomadAFg: -0.40442097187042236,
        LRT_score: 0.5459514260292053,
        LRT_Omega: -0.33704519271850586,
        gnomadGeneZscore: 0.4999160170555115,
        gnomadGenePLI: -1.5289617776870728,
        gnomadGeneOELofUpper: -0.9041250944137573,
        IMPACT: 0.27632856369018555,
        CADD_PHRED: 0.914547860622406,
        conservationScoreGnomad: 0.0,
        conservationScoreOELof: 0.0,
        zyg: -0.8454621434211731,
        ESP6500_AA_AF: 0.005180926527827978,
        ESP6500_EA_AF: -0.019259799271821976,
        hom: 0.05830543115735054,
        spliceAImax: 0.43950018286705017,
        cons_transcript_ablation: 0.0,
        cons_splice_acceptor_variant: 0.011528439819812775,
        cons_splice_donor_variant: 0.00015670758148189634,
        cons_stop_gained: 0.013949702493846416,
        cons_frameshift_variant: -0.02813241258263588,
        cons_stop_lost: 0.0,
        cons_start_lost: -0.0008258793968707323,
        cons_transcript_amplification: 0.0,
        cons_inframe_insertion: 0.0,
        cons_inframe_deletion: -0.004182072822004557,
        cons_missense_variant: -0.03991997614502907,
        cons_protein_altering_variant: 0.0,
        cons_splice_region_variant: 0.029942847788333893,
        cons_splice_donor_5th_base_variant: 0.0,
        cons_splice_donor_region_variant: 0.0,
        'IMPACT.from.Tier': 2.2122786045074463,
        TierAD: 0.0,
        TierAR: 1.889146089553833,
        'TierAR.adj': 0.0,
        'No.Var.HM': 0.0180351659655571,
        'No.Var.H': -0.25426721572875977,
        'No.Var.M': 0.11590445041656494,
        'No.Var.L': 0.1288938820362091,
        simple_repeat: 0.04646192491054535,
      },
      featureValues: {
        conservationScoreDGV: 1.0,
        gnomadAF: 1.864e-5,
        gnomadAFg: 1.864e-5,
        LRT_score: 0.0,
        LRT_Omega: 0.0,
        gnomadGeneZscore: 0.38049,
        gnomadGenePLI: 2.1983e-14,
        gnomadGeneOELofUpper: 0.926,
        IMPACT: 3.0,
        CADD_PHRED: 24.6,
        conservationScoreGnomad: 2.0,
        conservationScoreOELof: 1.0,
        zyg: 1.0,
        ESP6500_AA_AF: 0.0,
        ESP6500_EA_AF: 0.0,
        hom: 0.0,
        spliceAImax: 0.01,
        cons_transcript_ablation: 0.0,
        cons_splice_acceptor_variant: 0.0,
        cons_splice_donor_variant: 0.0,
        cons_stop_gained: 0.0,
        cons_frameshift_variant: 0.0,
        cons_stop_lost: 0.0,
        cons_start_lost: 0.0,
        cons_transcript_amplification: 0.0,
        cons_inframe_insertion: 0.0,
        cons_inframe_deletion: 0.0,
        cons_missense_variant: 1.0,
        cons_protein_altering_variant: 0.0,
        cons_splice_region_variant: 0.0,
        cons_splice_donor_5th_base_variant: 0.0,
        cons_splice_donor_region_variant: 0.0,
        'IMPACT.from.Tier': 3.0,
        TierAD: 2.0,
        TierAR: 2.0,
        'TierAR.adj': 2.0,
        'No.Var.HM': 2.0,
        'No.Var.H': 0.0,
        'No.Var.M': 2.0,
        'No.Var.L': 0.0,
        simple_repeat: 0.0,
      },
    });
    plot.init();

    // Assert that the SVG was added
    const svg = document.querySelector('#plot-container svg');
    expect(svg).not.toBeNull();
  });
});
