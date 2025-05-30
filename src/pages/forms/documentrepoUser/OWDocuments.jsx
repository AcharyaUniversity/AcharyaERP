import { Box, IconButton, Grid, Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import GridIndex from "../../../components/GridIndex"
import axios from "../../../services/Api";
import moment from "moment";
import { useNavigate } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { GenerateStudentAdmissionCancellation } from "./templates/StudentAdmissionCancellation";
import { GenerateStudentAdmission } from "./templates/StudentAdmission";
import PDFPreview from "./PDFPreview";
import { GenerateRelievingOrder } from "./templates/RelievingOrder";
import { GenerateJoiningOrder } from "./templates/JoiningOrder";
import jsPDF from "jspdf";
import DOMPurify from "dompurify";
const logos = require.context("../../../assets", true);

const DEFAULT_CURRENT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const OutwardCommunicationDocuments = () => {
    const [dataLoading, setDataLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [documents, setDocuments] = useState([]);
    const [filePath, setFilePath] = useState("");
    const [fileName, setFileName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const setCrumbs = useBreadcrumbs();

    useEffect(() => {
        setCrumbs([]);
        getAlldata();
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (documents.length <= 0) return;
    }, [documents]);

    useEffect(() => {
        if ((fileName !== null && fileName !== '') && (filePath !== null && filePath !== '')) {
            setShowModal(true)
        }
    }, [fileName, filePath]);

    const columns = [
        { field: "referenceNo", headerName: "Order No", flex: 1 },
        {
            field: "createdDate", headerName: "Order Date", flex: 1, valueGetter: (value, row) =>
                row.createdDate
                    ? moment(row.createdDate).format("DD-MM-YYYY")
                    : ""
        },
        { field: "categoryShortName", headerName: "Category", flex: 1 },
        { field: "createdBy", headerName: "Created By", flex: 1 },

        {
            field: "id", headerName: "Document", flex: 1,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => handleSelectedDocumentPreview(params.row)}
                    >
                        <VisibilityIcon color="primary" />
                    </IconButton>
                );
            },
        },
    ];

    const getAlldata = async () => {
        try {
            setDataLoading(true);
            const res = await axios.get(
                `/api/customtemplate/getCustomTemplateList?pageNo=${currentPage}&pageSize=${pageSize}`
            );
            const data = res.data.data.content.map((ele, index) => ({
                ...ele,
                id: index + 1
            }));

            if (data.length <= 0) return;
            setDocuments(data);
            setDataLoading(false);
        } catch (error) {
            setDataLoading(false);
            console.log(error)
        }
    };

    const handleSelectedDocumentPreview = async (selectedObj) => {
        setDataLoading(true);
        const { templateType } = selectedObj
        if (templateType === "CUSTOM") {
            generateBlobFile(selectedObj)
        } else if (templateType === "INSTANT") {
            generateInstantPdf(selectedObj)
        }
    }

    const generateBlobFile = async (docData) => {
        const { referenceNo, userCode, created_date, categoryDetailId, withLetterHead } = docData
        const letterHead = withLetterHead ? "Yes" : "No"
        const userDetails = await getUserDetails(userCode)
        if (Object.keys(userDetails).length <= 0) return

        const date = moment(created_date).format("DD/MM/YYYY")
        if (categoryDetailId === 18) {
            // Student Admission Cancellation
            const { name, dateOfAdmission, cancelAdmissionDate } = userDetails
            const doa = moment(dateOfAdmission).format("DD/MM/YYYY")
            const dateOfCancellAdmission = moment(cancelAdmissionDate).format("DD/MM/YYYY")
            const blobFile = await GenerateStudentAdmissionCancellation(referenceNo, name, userCode, letterHead, date, doa, dateOfCancellAdmission)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("student_admission_cancellation_")
        } else if (categoryDetailId === 17) {
            // Student Admission
            const { name, dateOfAdmission, academicYear } = userDetails
            const doa = moment(dateOfAdmission).format("DD/MM/YYYY")
            const blobFile = await GenerateStudentAdmission(referenceNo, name, userCode, letterHead, date, academicYear, doa)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("student_admission_")
        } else if (categoryDetailId === 20) {
            // Staff Relieving
            const { name, dateOfRelieving, designationName } = userDetails
            const dol = moment(dateOfRelieving).format("DD/MM/YYYY")
            const blobFile = await GenerateRelievingOrder(referenceNo, name, dol, letterHead, date, designationName)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("Relieving_order_")
        } else if (categoryDetailId === 19) {
            // Joining Order
            const { name, dateOfJoining, designationName, salary } = userDetails
            const doj = moment(dateOfJoining).format("DD/MM/YYYY")
            const blobFile = await GenerateJoiningOrder(referenceNo, name, doj, letterHead, date, designationName, salary)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("Joining_order_")
        }

        setDataLoading(false);
    };

    const generateInstantPdf = (data) => {
        const { content, withLetterHead, referenceNo, created_date } = data;
        const sanitizedHTML = DOMPurify.sanitize(`<div>${content}<div/>`);
        const newDiv = sanitizedHTML
        const doc = new jsPDF("p", "pt", "letter");
        const parser = new DOMParser()
        const doc_ = parser.parseFromString(newDiv, "text/html")
        const parentDiv = doc_.body.children[0]
        const parnetDivChildrens = parentDiv.children

        for (const _children of parnetDivChildrens) {
            const hasClassName = isNodeHasClassName(_children)
            if (hasClassName) {
                replaceClassNameWithStyle(_children)
            }

            const childs = _children.children
            if (childs.length > 0) {
                for (const child of childs) {
                    const hasClassName = isNodeHasClassName(child)
                    if (hasClassName) {
                        replaceClassNameWithStyle(child)
                    }
                }
            }
        }

        if (withLetterHead) {
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();
            doc.addImage(`${logos(
                `./${`${data.org_type}${data.school_name_short}`?.toLowerCase()}.jpg`
            )}`, 'JPEG', 0, 0, width, height);
        }

        let margin = [150, 0, 72, 30]
        if (!withLetterHead) {
            margin = [30, 0, 30, 30]
        }

        doc.html(parentDiv.outerHTML, {
            async callback(doc) {
                setFilePath(doc.output('datauristring'))
                setFileName(referenceNo)
                setDataLoading(false)
            },
            margin: margin,
            width: withLetterHead ? 668 : 750,
            windowWidth: withLetterHead ? 668 : 750,
            x: withLetterHead ? 15 : 10,
            y: 0,
            html2canvas: { scale: 0.7 },
            autoPaging: "text"
        })
    }

    const isNodeHasClassName = (node) => {
        return node.classList.length
    }

    const replaceClassNameWithStyle = (node) => {
        const classNames = node.classList
        for (const className of classNames) {
            if (className === "ql-indent-1") {
                node.style.textIndent = "20px"
            } else if (className === "ql-indent-2") {
                node.style.textIndent = "40px"
            } else if (className === "ql-indent-3") {
                node.style.textIndent = "60px"
            } else if (className === "ql-indent-4") {
                node.style.textIndent = "80px"
            } else if (className === "ql-indent-5") {
                node.style.textIndent = "100px"
            } else if (className === "ql-indent-6") {
                node.style.textIndent = "120px"
            } else if (className === "ql-indent-7") {
                node.style.textIndent = "140px"
            } else if (className === "ql-indent-8") {
                node.style.textIndent = "160px"
            }
        }

        return node
    }

    const getUserDetails = (userCode) => {
        return new Promise(async resolve => {
            try {
                const res = await axios.get(`/api/getUserDetailsWithSearchText?userCode=${userCode}`)
                const data = res.data.data
                if (Object.keys(data).length <= 0) {
                    resolve({})
                    return
                }

                resolve(data)
            } catch (error) {
                setDataLoading(false);
                console.log(error);
                alert("Failed to get user details")
                resolve({})
            }
        })
    }

    return (
        <>
            {showModal && (
                <PDFPreview
                    fileName={fileName}
                    filePath={filePath}
                    openModal={showModal}
                    handleModal={setShowModal}
                    templateType=""
                    showDownloadButton={true}
                />
            )}
            <Box mt={3}>
                <Box
                    sx={{
                        width: { md: "20%", lg: "15%", xs: "68%" },
                        position: "absolute",
                        right: 30,
                        marginTop: { xs: -2, md: -7 },
                    }}
                >
                    <Grid container mb={2}>
                        <Grid item xs={12} align="right">
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={() => navigate(`/documentsrepo-user/custom-template`)}
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <GridIndex rows={documents || []} columns={columns} />
            </Box>
        </>
    );
}

export default OutwardCommunicationDocuments