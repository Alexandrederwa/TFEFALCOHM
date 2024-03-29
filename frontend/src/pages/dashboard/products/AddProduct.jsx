import {
  Box,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import Resizer from "react-image-file-resizer";

const categories = [
  { value: "music", label: "Musics" },
  { value: "light", label: "Light" },
  { value: "digital", label: "Digital" },
];
const AddProduct = ({
  fetchProducts,
  edit,
  setEditProduct,
  isPending,
  editProduct,
  setEdit,
}) => {
  const [name, setName] = useState(editProduct?.name || "");
  const [category, setCategory] = useState(editProduct?.category || "");
  const [stock, setStock] = useState(editProduct?.stock || "");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(editProduct?.price || "");
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(editProduct?.image);

  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const uploadImage = async () => {
    try {
      setImageLoading(true);
      if (!previewImage) return alert("Failed");
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dutkkgjm5/image/upload",
        {
          upload_preset: "falcohm_image",
          file: previewImage
        },
        { withCredentials: false }
      );
      if (data) {
        console.log({ data });
        setImage(data.secure_url);
        setImageLoading(false);
      }
    } catch (error) {
      console.log(error)
      setImageLoading(false);
      alert("Failed to upload the Image");
    }
  };
  const imageOnChange = (e) => {
    if (e.target.name === "image") {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.readyState === 2) {
          // const resizedIMG = await resizeFile(e.target.files[0])
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleReset = async () => {
    setName("");
    setPrice("");

    setStock("");
    setImage("");
    setPreviewImage("");
    setCategory("");
    setEdit(false);
    setEditProduct(null);
  };
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/products/add", {
        name,
        category,
        stock,
        price,
        image,
      });
      if (data) {
        fetchProducts();
        setLoading(false);
        alert("Article ajouté");
      }
    } catch (error) {
      console.log(error);
      setError(error?.response.data.message);
    }
  };
  // const handleSetCategory = (e) => {
  //   setCategory(categories.find((val) => val.value === e.value).value);
  // };
  const handleSubmitEdit = async (e) => {
    if (!previewImage) {
      setError("No Image found");
    }
    e.preventDefault();
    setError("");

    try {
      const fields = {};
      //verify data before request
      if (name && name !== editProduct.name) fields.name = name;
      if (price && price !== editProduct.price) fields.price = price;
      if (stock && stock !== editProduct.stock) fields.stock = stock;
      if (category && category !== editProduct.category)
        fields.category = category.value;
      if (image && image !== editProduct.image) fields.image = image;
      setLoading(true);
      const { data } = await axios.put(`api/products/${editProduct.id}`, fields);
      if (data) {
        fetchProducts();
        setLoading(false);
        setEditProduct(null);
        alert("Article modifié");
        setEdit(false);
        handleReset();
      }
    } catch (error) {
      console.log(error);
      setError(error?.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (edit && editProduct) {
      setName(editProduct.name);
      setPrice(editProduct.price);

      setStock(editProduct.stock);
      setPreviewImage(editProduct.image);

      setCategory(
        categories.find((val) => val.value === editProduct.category).value
      );
    }
    // eslint-disable-next-line
  }, [edit, editProduct]);
  return (
    <Box
      component={"form"}
      onReset={handleReset}
      noValidate
      // sx={{ display: { md: "block", sm: "flex" } }}
      className="addProduct"
      onSubmit={!edit ? handleSubmitAdd : handleSubmitEdit}
    >
      {error}
      <Box sx={{ textAlign: "center" }}>
        <TextField
          type="text"
          value={name}
          margin="normal"
          fullWidth
          onChange={(e) => setName(e.target.value)}
          sx={{ margin: " 10px auto", padding: "4px" }}
          label="Nom du produit"
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <TextField
          type="number"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ margin: " 10px auto", padding: "4px" }}
          label="Prix unitaire "
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <TextField
          type="number"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={stock}
          onChange={(e) => {
            if (e.target.value > 0) return setStock(e.target.value);
          }}
          sx={{ margin: " 10px auto", padding: "4px" }}
          label="Stock disponible "
        />
      </Box>
      <Box sx={{ textAlign: "center", minWidth: { xs: "80%", md: "120px" } }}>
        <FormControl fullWidth>
          <InputLabel id="Category">Type</InputLabel>
          <Select
            labelId="Category"
            id="Category"
            value={category}
            defaultValue={categories[0].value}
            label="Catégorie"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem value={category.value}>
                {category.label.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: "center",
          alignItems: "center",
          margin: "5px",
        }}
      >
        <Button variant="contained" color="warning" component="label">
          Image (en portrait)  <ArrowCircleUpIcon color="red" />
          
          <input
            type="file"
            accept="images/*"
            name="image"
            hidden
            disabled={imageLoading}
            id={"Image"}
            onChange={imageOnChange}
          />
        </Button>
        {previewImage && (
          <img
            style={{ margin: "0 10px", borderRadius: "5px" }}
            src={previewImage}
            alt={editProduct?.name}
            width={100}
            height={80}
          />
        )}
        {previewImage && previewImage !== editProduct?.image && (
          <Button
            size="small"
            disabled={imageLoading}
            variant="outlined"
            sx={{ marginTop: { md: "0", xs: "5px" } }}
            color="info"
            onClick={uploadImage}
          >
            {imageLoading ? "Uploading..." : "Upload Image"}
          </Button>
        )}
      </Box>
   
      <Box sx={{marginTop:{xs:"20px",md:"0"}}}>
        <Button
          size="small"
          type="submit"
          variant="contained"
          sx={{ margin: "0 10px" }}
          disabled={loading || isPending || imageLoading || image === ""}
          className="submitBtn"
        >
          {edit ? "Update" : "Add"}
        </Button>
        <Button
          type="reset"
          variant="outlined"
          size="small"
          disabled={loading || isPending}
          className="submitBtn"
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default AddProduct;
