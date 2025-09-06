#!/usr/bin/env python3
"""
Step-by-step dependency installation script
"""
import subprocess
import sys
import os

def run_pip_install(requirements_file):
    """Install requirements from a file"""
    try:
        print(f"Installing from {requirements_file}...")
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", requirements_file
        ], capture_output=True, text=True, check=True)
        print(f"✅ Successfully installed {requirements_file}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {requirements_file}")
        print(f"Error: {e.stderr}")
        return False

def install_individual_package(package):
    """Install a single package"""
    try:
        print(f"Installing {package}...")
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", package
        ], capture_output=True, text=True, check=True)
        print(f"✅ Successfully installed {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("RAG Agent Dependency Installation")
    print("=" * 40)
    
    # Step 1: Install minimal requirements
    print("\n1. Installing minimal requirements...")
    if not run_pip_install("requirements_minimal.txt"):
        print("Failed at minimal requirements. Stopping.")
        return
    
    # Step 2: Install AI requirements one by one
    print("\n2. Installing AI requirements...")
    ai_packages = [
        "openai==1.3.7",
        "langchain==0.1.0", 
        "langchain-openai==0.0.5",
        "langchain-community==0.0.12",
        "faiss-cpu==1.7.4",
        "google-generativeai==0.3.2"
    ]
    
    for package in ai_packages:
        if not install_individual_package(package):
            print(f"⚠️  Skipping {package}, continuing with others...")
    
    # Step 3: Install service requirements
    print("\n3. Installing service requirements...")
    service_packages = [
        "pytesseract==0.3.10",
        "Pillow==10.1.0", 
        "deep-translator==1.11.4",
        "gTTS==2.4.0"
    ]
    
    for package in service_packages:
        if not install_individual_package(package):
            print(f"⚠️  Skipping {package}, continuing with others...")
    
    print("\n✅ Installation complete!")
    print("Run 'python test_services.py' to test the installation.")

if __name__ == "__main__":
    main()