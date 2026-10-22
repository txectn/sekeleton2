// import { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Input from "@mui/material/Input";

// import { useApiMutation } from "../../../hooks/mutations/useApiMutation";

// import { ACCESS_TOKEN } from "../../../config";
// import DashboardMenu from "../dropdowns/dashboardMenu";
// import DashboardSelect from "../dropdowns/dashboardSelect";

// import { container, title } from "../dashboardStyle";
// import { alertTitleClasses } from "@mui/material/AlertTitle";
// import { border, borderRadius, boxSizing, display, height, justifyContent } from "@mui/system";
// import { EllipsisVertical } from "lucide-react";
// import UploadImage from "../../../components/uploadComponents/upLoadImage";

// import styles from "./product.module.css";
// import Button from "@mui/material/Button";

// const ACCESS_TOKEN_VALUE =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzk0OTUzNDUyLCJpYXQiOjE3OTIzNjE0NTIsImp0aSI6IjcwZDcxYTgxNjAxNjRkMmNiYzJlNWE2YTdkZjcyMjI3IiwidXNlcl9pZCI6IjEiLCJ0b2tlbl92ZXJzaW9uIjowfQ.d1dOwnOKgRgRMIOvd8M_GFIwwXXZMmMSGar1Cnf_-BY";

// export default function ProductCreate() {
//     const cssStyle = {
//         btn: {
//             textTransform: "none",
//             fontSize: "var(--fs-sm-md)",
//             color: "var(--brand-primary)",
//             backgroundColor: "var(--brand-primary)",
//             width: "fit-content",
//             color: "var(--text-inverse)",
//             padding: "0.4rem 1rem",
//             borderRadius: "0.5rem",
//             "@media (pointer: fine)": {
//                 "&:hover": {
//                     backgroundColor: "var(--bg-hover-mui-element2)",
//                 },
//             },
//             "@media (pointer: coarse)": {
//                 "&:active": {
//                     backgroundColor: "var(--bg-hover-mui-ripple-element2)",
//                 }
//             },

//             "& .MuiTouchRipple-root": {
//                 color: "var(--bg-hover-mui-ripple-element2)",
//             },
//         },
//     }

//     useEffect(() => {
//         localStorage.setItem(ACCESS_TOKEN, ACCESS_TOKEN_VALUE);
//     }, []);

//     const [image, setImage] = useState([]);

//     const [mediaData, setMediaData] = useState([]);

//     const [product, setProduct] = useState({
//         name: "",
//         slug: "",
//         description: "",
//         brand: "",
//         category: "",
//         model: null,
//         collections: [],
//         tags: [],
//         shipping_class_rates: null,
//         is_active: true,
//         options: [],
//         variants: [],
//         metafields: [],
//     });

//     const [mediaFiles, setMediaFiles] = useState([]);

//     const createProduct = useApiMutation({
//         method: "post",
//         path: "/api/admin/products/",

//         onSuccess: (data) => {
//             console.log("Product created:", data);
//         },

//         onError: (error) => {
//             console.error(error.response?.data);
//         },
//     });

//     const handleChange = (event) => {
//         const { name, value, type, checked } = event.target;

//         setProduct((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleMediaChange = (event) => {
//         setMediaFiles(Array.from(event.target.files || []));
//     };

//     const submitProduct = () => {
//         const payload = {
//             ...product,
//             brand: Number(product.brand),
//             category: Number(product.category),
//         };

//         const formData = new FormData();

//         // Product data as JSON
//         formData.append("data", JSON.stringify(payload));

//         // Image files as multipart fields
//         mediaFiles.forEach((file) => {
//             formData.append("media", file);
//         });

//         createProduct.mutate({
//             body: formData,
//         });
//     };

//     const categoryData = [
//         {
//             id: 1,
//             name: "Category 1",
//         },

//         {
//             id: 2,
//             name: "Category 2",
//         },

//         {
//             id: 3,
//             name: "Category 3",
//         },
//     ]

//     const [categoryFormData, setCategoryFormData] = useState({
//         categoryII: null,
//     })

//     const addMediaRow = () => {
//         setMedia((prev) => [
//             ...prev,
//             {
//                 image: null,
//                 name: "",
//                 position: "",
//             },
//         ]);
//     };

//     const updateMediaRow = (index, field, value) => {
//         setMedia((prev) =>
//             prev.map((item, i) =>
//                 i === index
//                     ? { ...item, [field]: value }
//                     : item
//             )
//         );
//     };

//     const getValidMedia = () => {
//         return media.filter(
//             (item) =>
//                 item.image ||
//                 item.name.trim() ||
//                 item.position !== ""
//         );
//     };

//     return (
//         <>
//             <div className={styles.container}>
//                 <div className={styles.left}>
//                     <div className={styles.sectionTitle}>
//                         Products
//                     </div>
//                     <div className={styles.section}>
//                         <div className={styles.group}>
//                             <label className={styles.label}>
//                                 Title
//                             </label>
//                             <input type="text" className={`${styles.field} ${styles.input}`} />
//                         </div>
//                         <div className={styles.group}>
//                             <label className={styles.label}>
//                                 Slug
//                             </label>
//                             <input type="text" className={`${styles.field} ${styles.input}`} />
//                         </div>
//                         <div className={styles.group}>
//                             <label className={styles.label}>
//                                 Description
//                             </label>
//                             <textarea className={`${styles.field} ${styles.input} ${styles.textArea}`} />
//                         </div>
//                         <div className={styles.group}>
//                             <label className={styles.label}>
//                                 Media
//                             </label>
//                             <div className={styles.mediaFilesInput}>
//                                 <div className={styles.mediaHead}>
//                                     <div className={styles.mediaTitle}>Image</div>
//                                     <div className={styles.mediaTitle}>Name</div>
//                                     <div className={styles.mediaTitle}>Position</div>
//                                 </div>
//                                 <div className={styles.mediaBody}>
//                                     <UploadImage
//                                         setData={setImage}
//                                         width={"200px"}
//                                         height={"4.83rem"}
//                                         iconSize={"25px"}
//                                         typography1Style={{
//                                             display: "none",
//                                         }}
//                                         typography2Style={{
//                                             display: "none",
//                                         }}
//                                         showPreview={true}
//                                         type="array"
//                                         borderRadius={"7px"}
//                                     />
//                                     <input type="text" className={`${styles.field} ${styles.input}`} />
//                                     <input type="text" className={`${styles.field} ${styles.input}`} />
//                                 </div>
//                             </div>
//                             <Button
//                                 className={styles.btn}
//                                 sx={{
//                                     ...cssStyle.btn
//                                 }}
//                             >
//                                 Add Media
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className={styles.right}>Right Side</div>
//             </div>
//             {/* <Box
//             sx={{
//                 minHeight: "calc(100vh - 130px)",
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "5rem",
//                 paddingLeft: "4rem",
//                 paddingRight: "5rem",
//                 paddingTop: "1.5rem",
//                 "@media (max-width: 1000px)": {
//                     padding: "2rem"
//                 },
//             }}
//         >
//             <Box
//                 sx={{
//                     flex: 3,
//                 }}
//             >
//                 <Box
//                     sx={{
//                         ...cssStyle.sectionTitle
//                     }}
//                 >
//                     Products
//                 </Box>
//                 <Box
//                     sx={{
//                         ...cssStyle.section
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             ...cssStyle.group
//                         }}
//                     >
//                         <label
//                             style={{
//                                 ...cssStyle.label
//                             }}
//                         >
//                             Title
//                         </label>
//                         <Input
//                             disableUnderline={true}
//                             sx={{
//                                 ...cssStyle.input
//                             }}
//                         />
//                     </Box>
//                     <Box
//                         sx={{
//                             ...cssStyle.group
//                         }}
//                     >
//                         <label
//                             style={{
//                                 ...cssStyle.label
//                             }}
//                         >
//                             Description
//                         </label>
//                         <Box
//                             sx={{
//                                 position: "relative",
//                                 width: "100%",
//                             }}
//                         >
//                             <Input
//                                 multiline
//                                 disableUnderline={true}
//                                 sx={{
//                                     ...cssStyle.input,
//                                     ...cssStyle.textArea
//                                 }}
//                             />
//                         </Box>
//                     </Box>
//                     <Box
//                         sx={{
//                             ...cssStyle.group
//                         }}
//                     >
//                         <label
//                             style={{
//                                 ...cssStyle.label
//                             }}
//                         >
//                             Media
//                         </label>
//                         <Box
//                             sx={{
//                                 ...cssStyle.input,
//                                 height: "fit-content",
//                                 padding: "2rem",
//                                 display: "flex",
//                                 // flexWrap: "wrap",
//                                 flexDirection: "column",
//                                 gap: "2rem",
//                             }}
//                         >
//                             <UploadImage
//                                 setData={setImageData}
//                                 width={"150px"}
//                                 height={"150px"}
//                                 iconSize={"30px"}
//                                 typography1Style={{
//                                     display: "none",
//                                 }}
//                                 showPreview={false}
//                                 type="array"
//                                 borderRadius={"7px"}
//                             />
//                             {imageData.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={image ? URL.createObjectURL(image) : ""}
//                                     alt="uploaded image"
//                                     style={{
//                                         width: "150px",
//                                         height: "150px",
//                                         objectFit: "contain",
//                                     }}
//                                 />
//                             ))}
//                         </Box>
//                     </Box>
//                 </Box>
//             </Box>
//             <Box
//                 sx={{
//                     flex: 1,
//                     height: "fit-content",

//                     backgroundColor: "var(--bg-main)",
//                     boxShadow: "0 0 5px var(--shadow-80)",
//                     borderRadius: "10px",

//                     position: "sticky",
//                     top: "3.1rem",
//                 }}
//             >
//                 right side
//             </Box>
//         </Box> */}
//         </>
//         // <div>
//         //     <h2>Create Product</h2>

//         //     <DashboardMenu
//         //         setFormData={setCategoryFormData}
//         //         name="categoryII"
//         //         menuData={categoryData}
//         //         type={"number"}
//         //     >
//         //         Category
//         //     </DashboardMenu>

//         //     <DashboardSelect
//         //         setFormData={setCategoryFormData}
//         //         formData={categoryFormData}
//         //         name="categoryII"
//         //         menuData={categoryData}
//         //     >
//         //         Category
//         //     </DashboardSelect>
//         //     <h1>
//         //         <h1>{JSON.stringify(categoryFormData.categoryII, null, 2)}</h1>
//         //     </h1>
//         //     <div>
//         //         <label>Product name</label>
//         //         <input
//         //             name="name"
//         //             value={product.name}
//         //             onChange={handleChange}
//         //         />
//         //     </div>

//         //     <div>
//         //         <label>Slug</label>
//         //         <input
//         //             name="slug"
//         //             value={product.slug}
//         //             onChange={handleChange}
//         //         />
//         //     </div>

//         //     <div>
//         //         <label>Description</label>
//         //         <textarea
//         //             name="description"
//         //             value={product.description}
//         //             onChange={handleChange}
//         //         />
//         //     </div>

//         //     <div>
//         //         <label>Brand ID</label>
//         //         <input
//         //             name="brand"
//         //             type="number"
//         //             value={product.brand}
//         //             onChange={handleChange}
//         //         />
//         //     </div>

//         //     <div>
//         //         <label>Category ID</label>
//         //         <input
//         //             name="category"
//         //             type="number"
//         //             value={product.category}
//         //             onChange={handleChange}
//         //         />
//         //     </div>

//         //     <div>
//         //         <label>Product images</label>
//         //         <input
//         //             type="file"
//         //             accept="image/*"
//         //             multiple
//         //             onChange={handleMediaChange}
//         //         />
//         //     </div>

//         //     {mediaFiles.map((file, index) => (
//         //         <p key={`${file.name}-${index}`}>
//         //             {file.name}
//         //         </p>
//         //     ))}

//         //     <button
//         //         type="button"
//         //         onClick={submitProduct}
//         //         disabled={createProduct.isPending}
//         //     >
//         //         {createProduct.isPending
//         //             ? "Creating..."
//         //             : "Create Product"}
//         //     </button>
//         // </div>
//     );
// }






















// import { useState } from "react";
// import Button from "@mui/material/Button";
// import UploadImage from "../../../components/uploadComponents/upLoadImage";

// import styles from "./product.module.css";

// export default function ProductCreate() {
//     const [mediaData, setMediaData] = useState([
//         {
//             image: null,
//             name: "",
//             position: "",
//         },
//     ]);

//     const cssStyle = {
//         btn: {
//             textTransform: "none",
//             fontSize: "var(--fs-sm-md)",
//             color: "var(--text-inverse)",
//             backgroundColor: "var(--brand-primary)",
//             width: "fit-content",
//             padding: "0.4rem 1rem",
//             borderRadius: "0.5rem",
//             "@media (pointer: fine)": {
//                 "&:hover": {
//                     backgroundColor: "var(--bg-hover-mui-element2)",
//                 },
//             },
//             "@media (pointer: coarse)": {
//                 "&:active": {
//                     backgroundColor: "var(--bg-hover-mui-ripple-element2)",
//                 },
//             },
//             "& .MuiTouchRipple-root": {
//                 color: "var(--bg-hover-mui-ripple-element2)",
//             },
//         },
//     };

//     const addMediaRow = () => {
//         setMediaData((prev) => [
//             ...prev,
//             {
//                 image: null,
//                 name: "",
//                 position: "",
//             },
//         ]);
//     };

//     const updateMediaRow = (index, field, value) => {
//         setMediaData((prev) =>
//             prev.map((item, i) =>
//                 i === index
//                     ? { ...item, [field]: value }
//                     : item
//             )
//         );
//     };

//     const getValidMedia = () =>
//         mediaData.filter(
//             (item) =>
//                 item.image ||
//                 item.name.trim() ||
//                 item.position !== ""
//         );

//     return (
//         <div className={styles.container}>
//             <div className={styles.left}>
//                 <div className={styles.sectionTitle}>
//                     Products
//                 </div>

//                 <div className={styles.section}>
//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Title
//                         </label>
//                         <input
//                             type="text"
//                             className={`${styles.field} ${styles.input}`}
//                         />
//                     </div>

//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Slug
//                         </label>
//                         <input
//                             type="text"
//                             className={`${styles.field} ${styles.input}`}
//                         />
//                     </div>

//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Description
//                         </label>
//                         <textarea
//                             className={`${styles.field} ${styles.input} ${styles.textArea}`}
//                         />
//                     </div>

//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Media
//                         </label>

//                         <div className={styles.mediaFilesInput}>
//                             <div className={styles.mediaHead}>
//                                 <div className={styles.mediaTitle}>
//                                     Image
//                                 </div>
//                                 <div className={styles.mediaTitle}>
//                                     Name
//                                 </div>
//                                 <div className={styles.mediaTitle}>
//                                     Position
//                                 </div>
//                             </div>

//                             {mediaData.map((item, index) => (
//                                 <div
//                                     className={styles.mediaBody}
//                                     key={index}
//                                 >
//                                     <UploadImage
//                                         setData={(value) =>
//                                             updateMediaRow(
//                                                 index,
//                                                 "image",
//                                                 Array.isArray(value)
//                                                     ? value[0] ?? null
//                                                     : value
//                                             )
//                                         }
//                                         width="200px"
//                                         height="4.83rem"
//                                         iconSize="25px"
//                                         typography1Style={{
//                                             display: "none",
//                                         }}
//                                         typography2Style={{
//                                             display: "none",
//                                         }}
//                                         showPreview={true}
//                                         type="array"
//                                         borderRadius="7px"
//                                     />

//                                     <input
//                                         type="text"
//                                         className={`${styles.field} ${styles.input}`}
//                                         placeholder="Media name"
//                                         value={item.name}
//                                         onChange={(e) =>
//                                             updateMediaRow(
//                                                 index,
//                                                 "name",
//                                                 e.target.value
//                                             )
//                                         }
//                                     />

//                                     <input
//                                         type="number"
//                                         className={`${styles.field} ${styles.input}`}
//                                         placeholder="Position"
//                                         value={item.position}
//                                         onChange={(e) =>
//                                             updateMediaRow(
//                                                 index,
//                                                 "position",
//                                                 e.target.value
//                                             )
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                         </div>

//                         <Button
//                             type="button"
//                             className={styles.btn}
//                             sx={{ ...cssStyle.btn }}
//                             onClick={addMediaRow}
//                         >
//                             Add Media
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             <div className={styles.right}>
//                 <pre>{JSON.stringify(getValidMedia(), null, 2)}</pre>
//             </div>
//         </div>
//     );
// }







// import { useState } from "react";
// import Button from "@mui/material/Button";
// import UploadImage from "../../../components/uploadComponents/upLoadImage";

// import styles from "./product.module.css";

// export default function ProductCreate() {
//     const [mediaData, setMediaData] = useState([
//         {
//             image: null,
//             name: "",
//             position: "",
//         },
//     ]);

//     const cssStyle = {
//         btn: {
//             textTransform: "none",
//             fontSize: "var(--fs-sm-md)",
//             color: "var(--text-inverse)",
//             backgroundColor: "var(--brand-primary)",
//             width: "fit-content",
//             padding: "0.4rem 1rem",
//             borderRadius: "0.5rem",
//             "@media (pointer: fine)": {
//                 "&:hover": {
//                     backgroundColor: "var(--bg-hover-mui-element2)",
//                 },
//             },
//             "@media (pointer: coarse)": {
//                 "&:active": {
//                     backgroundColor: "var(--bg-hover-mui-ripple-element2)",
//                 },
//             },
//             "& .MuiTouchRipple-root": {
//                 color: "var(--bg-hover-mui-ripple-element2)",
//             },
//         },
//     };

//     const addMediaRow = () => {
//         setMediaData((prev) => [
//             ...prev,
//             {
//                 image: null,
//                 name: "",
//                 position: "",
//             },
//         ]);
//     };

//     const updateMediaRow = (index, field, value) => {
//         setMediaData((prev) =>
//             prev.map((item, i) =>
//                 i === index
//                     ? { ...item, [field]: value }
//                     : item
//             )
//         );
//     };

//     const getValidMedia = () =>
//         mediaData.filter(
//             (item) =>
//                 item.image ||
//                 item.name.trim() ||
//                 item.position !== ""
//         );

//     return (
//         <div className={styles.container}>
//             <div className={styles.left}>
//                 <div className={styles.sectionTitle}>
//                     Products
//                 </div>

//                 <div className={styles.section}>
//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Title
//                         </label>
//                         <input
//                             type="text"
//                             className={`${styles.field} ${styles.input}`}
//                         />
//                     </div>

//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Slug
//                         </label>
//                         <input
//                             type="text"
//                             className={`${styles.field} ${styles.input}`}
//                         />
//                     </div>

//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Description
//                         </label>
//                         <textarea
//                             className={`${styles.field} ${styles.input} ${styles.textArea}`}
//                         />
//                     </div>

//                     <div className={styles.group}>
//                         <label className={styles.label}>
//                             Media
//                         </label>

//                         <div className={styles.mediaFilesInput}>
//                             <div className={styles.mediaHead}>
//                                 <div className={styles.mediaTitle}>
//                                     Image
//                                 </div>
//                                 <div className={styles.mediaTitle}>
//                                     Name
//                                 </div>
//                                 <div className={styles.mediaTitle}>
//                                     Position
//                                 </div>
//                             </div>

//                             {mediaData.map((item, index) => (
//                                 <div
//                                     className={styles.mediaBody}
//                                     key={index}
//                                 >
//                                     <UploadImage
//                                         setData={(value) =>
//                                             updateMediaRow(
//                                                 index,
//                                                 "image",
//                                                 value
//                                             )
//                                         }
//                                         width="200px"
//                                         height="4.83rem"
//                                         iconSize="25px"
//                                         typography1Style={{
//                                             display: "none",
//                                         }}
//                                         typography2Style={{
//                                             display: "none",
//                                         }}
//                                         showPreview={true}
//                                         type="number"
//                                         borderRadius="7px"
//                                     />

//                                     <input
//                                         type="text"
//                                         className={`${styles.field} ${styles.input}`}
//                                         placeholder="Media name"
//                                         value={item.name}
//                                         onChange={(e) =>
//                                             updateMediaRow(
//                                                 index,
//                                                 "name",
//                                                 e.target.value
//                                             )
//                                         }
//                                     />

//                                     <input
//                                         type="number"
//                                         className={`${styles.field} ${styles.input}`}
//                                         placeholder="Position"
//                                         value={item.position}
//                                         onChange={(e) =>
//                                             updateMediaRow(
//                                                 index,
//                                                 "position",
//                                                 e.target.value
//                                             )
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                         </div>

//                         <Button
//                             type="button"
//                             className={styles.btn}
//                             sx={{ ...cssStyle.btn }}
//                             onClick={addMediaRow}
//                         >
//                             Add Media
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             <div className={styles.right}>
//                 <pre>
//                     {JSON.stringify(
//                         getValidMedia().map((item) => ({
//                             ...item,
//                             image: item.image?.name ?? null,
//                         })),
//                         null,
//                         2
//                     )}
//                 </pre>
//             </div>
//         </div>
//     );
// }












import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import UploadImage from "../../../components/uploadComponents/upLoadImage";
import { useApiMutation } from "../../../hooks/mutations/useApiMutation";

import { Icon, PlusIcon, Trash } from "lucide-react";

import styles from "./product.module.css";

export default function ProductCreate() {
    const [product, setProduct] = useState({
        name: "",
        slug: "",
        description: "",
        brand: "",
        category: "",
        model: null,
        collections: [],
        tags: [],
        shipping_class_rates: null,
        is_active: true,
        options: [],
        variants: [],
        metafields: [],
    });

    const [mediaData, setMediaData] = useState([
        {
            image: null,
            name: "",
            position: "",
        },
    ]);

    const createProduct = useApiMutation({
        method: "post",
        path: "/api/admin/products/",

        onSuccess: (data) => {
            console.log("Product created:", data);
        },

        onError: (error) => {
            console.error(error.response?.data);
        },
    });

    const cssStyle = {
        btn: {
            textTransform: "none",
            fontSize: "var(--fs-sm)",
            color: "var(--text-inverse)",
            backgroundColor: "var(--bg-inverse)",
            width: "fit-content",
            padding: "0.5rem 1.2rem",
            borderRadius: "0.5rem",

            "@media (pointer: fine)": {
                "&:hover": {
                    backgroundColor: "var(--bg-hover-mui-element1)",
                },
            },

            "@media (pointer: coarse)": {
                "&:active": {
                    backgroundColor: "var(--bg-hover-mui-ripple-element1)",
                },
            },

            "& .MuiTouchRipple-root": {
                color: "var(--bg-hover-mui-ripple-element1)",
            },
        },
        icon: {
            color: "var(--text-inverse)",
            size: 19
        }
    };

    // Generate a URL-friendly slug from the product name.
    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    // Automatically update the slug when the product name changes.
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,

            ...(name === "name" && {
                slug: generateSlug(value),
            }),
        }));
    };

    const addMediaRow = () => {
        setMediaData((prev) => [
            ...prev,
            {
                image: null,
                name: "",
                position: "",
            },
        ]);
    };

    const updateMediaRow = (index, field, value) => {
        setMediaData((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const getValidMedia = () => {
        return mediaData.filter(
            (item) =>
                item.image ||
                item.name.trim() ||
                item.position !== ""
        );
    };

    const submitProduct = () => {
        const validMedia = getValidMedia();

        const payload = {
            ...product,
            brand: Number(product.brand),
            category: Number(product.category),

            media: validMedia.map((item) => ({
                name: item.name,
                position:
                    item.position === ""
                        ? 0
                        : Number(item.position),
            })),
        };

        const formData = new FormData();

        // Product data and media metadata as JSON.
        formData.append("data", JSON.stringify(payload));

        // Attach the selected image files.
        validMedia.forEach((item) => {
            if (item.image) {
                formData.append("media", item.image);
            }
        });

        createProduct.mutate({
            body: formData,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.sectionGroup}>
                    <div className={styles.sectionTitle}>
                        Products
                    </div>
                    <div className={styles.section}>
                        <div className={styles.group}>
                            <label className={styles.label}>
                                Title
                            </label>

                            <input
                                type="text"
                                className={`${styles.field} ${styles.input}`}
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>
                                Slug
                            </label>

                            <input
                                type="text"
                                className={`${styles.field} ${styles.input}`}
                                name="slug"
                                value={product.slug}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>
                                Description
                            </label>

                            <textarea
                                className={`${styles.field} ${styles.input} ${styles.textArea}`}
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>
                                Media
                            </label>

                            <div className={styles.mediaFilesInput}>
                                <div className={styles.mediaHead}>
                                    <div className={styles.mediaTitle}>
                                        Image
                                    </div>

                                    <div className={styles.mediaTitle}>
                                        Name
                                    </div>

                                    <div className={styles.mediaTitle}>
                                        Position
                                    </div>
                                    <div className={styles.mediaTitle}>
                                        Delete
                                    </div>
                                </div>

                                {mediaData.map((item, index) => (
                                    <div
                                        className={styles.mediaBody}
                                        key={index}
                                    >
                                        <UploadImage
                                            setData={(value) =>
                                                updateMediaRow(
                                                    index,
                                                    "image",
                                                    value
                                                )
                                            }
                                            width="200px"
                                            height="4.83rem"
                                            iconSize="25px"
                                            typography1Style={{
                                                display: "none",
                                            }}
                                            typography2Style={{
                                                display: "none",
                                            }}
                                            showPreview={true}
                                            type="number"
                                            borderRadius="7px"
                                        />

                                        <input
                                            type="text"
                                            className={`${styles.field} ${styles.input}`}
                                            placeholder="Media name"
                                            value={item.name}
                                            onChange={(e) =>
                                                updateMediaRow(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            type="number"
                                            className={`${styles.field} ${styles.input}`}
                                            placeholder="Position"
                                            value={item.position}
                                            onChange={(e) =>
                                                updateMediaRow(
                                                    index,
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="">
                                            <IconButton
                                                onClick={() => deleteMediaRow(index)}
                                                sx={{ 
                                                    backgroundColor: "var(--bg-element)",
                                                    width: "40px",
                                                    height: "40px",
                                                 }}
                                            >
                                                <Trash size={cssStyle.icon.size} />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                className={styles.btn}
                                sx={{ ...cssStyle.btn }}
                                onClick={addMediaRow}
                                startIcon={<PlusIcon size={cssStyle.icon.size} color={cssStyle.icon.color} />}
                            >
                                Add Media
                            </Button>
                        </div>
                    </div>
                    <Button
                        type="button"
                        sx={{ ...cssStyle.btn }}
                        onClick={submitProduct}
                        disabled={createProduct.isPending}
                    >
                        {createProduct.isPending
                            ? "Saving..."
                            : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className={styles.right}>
                <pre>
                    {JSON.stringify(
                        {
                            ...product,
                            media: getValidMedia().map((item) => ({
                                image: item.image?.name ?? null,
                                name: item.name,
                                position: item.position,
                            })),
                        },
                        null,
                        2
                    )}
                </pre>
            </div>
        </div>
    );
}
















































