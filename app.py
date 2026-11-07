import streamlit as st
import pandas as pd
from rdkit import Chem
from rdkit.Chem import Descriptors, Lipinski, Draw
import py3Dmol
from stmol import showmol

# -----------------------------------------------------------------------------
# Page Configuration
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Cheminformatics Virtual Lab - SRM IST",
    page_icon="🧪",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Pure Black & High-Contrast CSS
st.markdown("""
<style>
    .stApp {
        background-color: #000000;
        color: #f8fafc;
    }
    .student-card {
        background-color: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 14px 20px;
        margin-bottom: 20px;
    }
    .metric-card {
        background-color: #090d16;
        border: 1px solid #1e293b;
        border-radius: 10px;
        padding: 12px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Student & Developer Information Banner
# -----------------------------------------------------------------------------
st.markdown("""
<div class="student-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div>
            <span style="font-size: 11px; font-weight: 700; color: #818cf8; text-transform: uppercase;">SRM Institute of Science & Technology • Tiruchirappalli Campus</span>
            <h3 style="margin: 2px 0; color: #ffffff;">🧪 Cheminformatics Virtual Laboratory</h3>
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                Student & Developer: <strong style="color: #c7d2fe;">K .D V V DEEPTHI MAHI</strong> | 
                Reg No: <code style="color: #818cf8;">RA2611030050077</code> | 
                Dept: <span style="color: #cbd5e1;">CSE w/s Cyber security</span>
            </p>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Navigation Tabs
# -----------------------------------------------------------------------------
tabs = st.tabs([
    "🔬 Virtual Lab (2D/3D & Descriptors)",
    "🎨 Molecule Colour ID",
    "🔍 Spot the Error Game",
    "🧠 Formula Practice",
    "📖 Lab Manual & Aim"
])

# =============================================================================
# TAB 1: 3D/2D Virtual Lab & Lipinski Descriptors
# =============================================================================
with tabs[0]:
    st.subheader("Interactive Molecular Visualization & Lipinski Properties")
    
    presets = {
        "Aspirin": "CC(=O)Oc1ccccc1C(=O)O",
        "Paracetamol": "CC(=O)Nc1ccc(O)cc1",
        "Ibuprofen": "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
        "Caffeine": "Cn1cnc2c1c(=O)n(c(=O)n2C)C",
        "Benzene": "c1ccccc1"
    }
    
    col1, col2 = st.columns([1, 2])
    with col1:
        selected_preset = st.selectbox("Select Preset Compound", list(presets.keys()))
        smiles_input = st.text_input("Or Enter Custom SMILES", presets[selected_preset])
    
    mol = Chem.MolFromSmiles(smiles_input)
    if mol:
        mol = Chem.AddHs(mol)
        
        # Calculate Descriptors
        mw = Descriptors.MolWt(mol)
        logp = Descriptors.MolLogP(mol)
        tpsa = Descriptors.TPSA(mol)
        hbd = Lipinski.NumHDonors(mol)
        hba = Lipinski.NumHAcceptors(mol)
        rot_bonds = Lipinski.NumRotatableBonds(mol)
        
        # 3D and 2D view columns
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            st.markdown("#### 3D Molecular Model (Py3Dmol)")
            # Generate 3D coordinates
            from rdkit.Chem import AllChem
            AllChem.EmbedMolecule(mol, randomSeed=42)
            mol_block = Chem.MolToMolBlock(mol)
            
            view = py3Dmol.view(width=450, height=350)
            view.addModel(mol_block, 'mol')
            view.setStyle({'stick': {'colorscheme': 'cyanCarbon'}})
            view.addStyle({'sphere': {'scale': 0.3}})
            view.setBackgroundColor('#000000')
            view.zoomTo()
            showmol(view, height=350, width=450)
            
        with vcol2:
            st.markdown("#### 2D Skeletal Structure")
            mol_2d = Chem.MolFromSmiles(smiles_input)
            img = Draw.MolToImage(mol_2d, size=(450, 350))
            st.image(img, use_column_width=True)
            
        # Descriptors Display
        st.markdown("#### Molecular Descriptors & Lipinski's Rule of 5")
        dcol1, dcol2, dcol3, dcol4, dcol5, dcol6 = st.columns(6)
        dcol1.metric("Mol Weight", f"{mw:.2f} g/mol")
        dcol2.metric("LogP", f"{logp:.2f}")
        dcol3.metric("TPSA", f"{tpsa:.1f} Å²")
        dcol4.metric("H-Bond Donors", hbd)
        dcol5.metric("H-Bond Acceptors", hba)
        dcol6.metric("Rotatable Bonds", rot_bonds)
    else:
        st.error("Invalid SMILES string entered. Please check syntax.")

# =============================================================================
# TAB 2: Molecule Colour ID (CPK Reference & Quiz)
# =============================================================================
with tabs[1]:
    st.subheader("🎨 Molecule Colour ID (CPK Standard)")
    st.markdown("Corey-Pauling-Koltun (CPK) universal elemental color codes in computational chemistry:")
    
    cpk_data = [
        {"Element": "Hydrogen (H)", "Color": "Pure White (#FFFFFF)", "Rationale": "Colorless, light gas."},
        {"Element": "Carbon (C)", "Color": "Charcoal / Dark Slate (#334155)", "Rationale": "Standard graphite and coal allotrope."},
        {"Element": "Nitrogen (N)", "Color": "Royal Blue (#2563EB)", "Rationale": "Earth's 78% nitrogen atmosphere."},
        {"Element": "Oxygen (O)", "Color": "Vibrant Red (#EF4444)", "Rationale": "Combustion, fire, and oxygenated blood."},
        {"Element": "Sulfur (S)", "Color": "Bright Yellow (#FACC15)", "Rationale": "Yellow elemental brimstone crystals."},
        {"Element": "Chlorine (Cl)", "Color": "Emerald Green (#10B981)", "Rationale": "From Greek 'khloros' (pale green gas)."}
    ]
    st.dataframe(pd.DataFrame(cpk_data), use_container_width=True)
    
    st.markdown("#### Quick Quiz: Test Your Knowledge")
    answer = st.radio("Which element is canonically represented in RED in 3D molecular viewers?", 
                      ["Carbon (C)", "Oxygen (O)", "Nitrogen (N)", "Sulfur (S)"])
    if st.button("Check Answer"):
        if answer == "Oxygen (O)":
            st.success("Correct! Oxygen is universally depicted in Red in CPK conventions.")
        else:
            st.error("Incorrect. Oxygen (O) is colored Red in CPK.")

# =============================================================================
# TAB 3: Spot the Error Game
# =============================================================================
with tabs[2]:
    st.subheader("🔍 Spot the Error Game (Chemical Structure Inspector)")
    st.markdown("Inspect flawed or illegal organic structures violating valency and chemical laws:")
    
    st.warning("⚠️ Buggy Structure: `CC(C)(C)(=O)C`")
    st.info("The structure shows a central carbon bonded to 3 methyl groups and double-bonded to oxygen.")
    
    choice = st.radio("What fundamental chemical rule is violated here?", [
        "Oxygen requires a positive charge",
        "Central carbon has 5 bonds ('Texas Carbon') violating the octet rule",
        "Methyl groups cannot bond to carbonyls",
        "The molecule is an illegal aromatic system"
    ])
    
    if st.button("Submit Inspection"):
        if "Texas Carbon" in choice:
            st.success("Correct! Carbon has only 4 valence orbitals and cannot form 5 bonds. This error is known as a 'Texas Carbon'.")
        else:
            st.error("Incorrect. The flaw is an impossible pentavalent carbon violating the octet rule.")

# =============================================================================
# TAB 4: Chemistry Formula Practice Mode
# =============================================================================
with tabs[3]:
    st.subheader("🧠 Chemistry Formula Practice Mode")
    f_ans = st.radio("Which common pharmaceutical analgesic has the molecular formula C9H8O4?", [
        "Paracetamol",
        "Aspirin (Acetylsalicylic Acid)",
        "Ibuprofen",
        "Caffeine"
    ])
    if st.button("Verify Formula"):
        if f_ans == "Aspirin (Acetylsalicylic Acid)":
            st.success("Correct! Aspirin's Hill system formula is C9H8O4 (MW: 180.16 g/mol).")
        else:
            st.error("Incorrect. Paracetamol is C8H9NO2, while Aspirin is C9H8O4.")

# =============================================================================
# TAB 5: Lab Manual & Aim
# =============================================================================
with tabs[4]:
    st.subheader("🧪 Virtual Laboratory Manual & Objectives")
    st.markdown("""
    ### Aim of the Experiment
    To develop a foundational understanding of Cheminformatics by using computational tools to represent, visualize, and analyze chemical structures.
    
    ### Learning Objectives
    1. **SMILES Representation**: Convert 2D/3D chemical structures into Simplified Molecular Input Line Entry System strings.
    2. **2D & 3D Visualization**: Inspect molecules using interactive stick/CPK ball-and-stick models.
    3. **Molecular Descriptors**: Calculate Molecular Weight, LogP, TPSA, H-bond donors/acceptors, and evaluate Lipinski's Rule of 5.
    4. **Structure-Property Relationships**: Understand how polarity, hydrogen bonding, and flexibility govern drug-likeness.
    """)
    st.caption("Developed by K .D V V DEEPTHI MAHI (Reg No: RA2611030050077) • SRM Institute of Science & Technology")
